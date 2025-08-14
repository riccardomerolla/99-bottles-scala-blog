val zioVersion = "2.0.15"

lazy val root = (project in file("."))
  .settings(
    name := "scala-zio-book",
    version := "0.1.0",
    scalaVersion := "3.3.0",
    libraryDependencies ++= Seq(
      "dev.zio" %% "zio" % zioVersion,
      "dev.zio" %% "zio-streams" % zioVersion,
      "dev.zio" %% "zio-test" % zioVersion % Test,
      "dev.zio" %% "zio-test-sbt" % zioVersion % Test
    ),
    testFrameworks += new TestFramework("zio.test.sbt.ZTestFramework")
  )

lazy val examples = (project in file("examples"))
  .settings(
    name := "scala-examples",
    scalaVersion := "3.3.0",
    libraryDependencies ++= Seq(
      "org.scalatest" %% "scalatest" % "3.2.16" % Test
    )
  )
  .settings(
    Compile / sourceGenerators += Def.task {
      import java.nio.file.{Files, Paths}
      import scala.jdk.CollectionConverters._
      val out = baseDirectory.value / "generated-src"
      val blogDir = baseDirectory.value.getParentFile.toPath.resolve("blog")
      val outPath = out.toPath
      val ScalaFence = "(?s)```scala(?:\\s+(.*?))?\\s*(.*?)```".r

      def parseInfo(info: String): Map[String, String] = {
        if (info == null) Map.empty
        else
          info.split("\\s+").toList.flatMap { token =>
            token.split("=", 2) match {
              case Array(k, v) => Some(k -> v)
              case _            => None
            }
          }.toMap
      }

      def looksLikeFullFile(code: String): Boolean = {
        code.linesIterator.map(_.trim).find(_.nonEmpty) match {
          case Some(line) =>
            line.startsWith("package ") || line.startsWith("object ") || line.startsWith("class ") || line.startsWith("trait ")
          case None => false
        }
      }

      if (!Files.exists(blogDir)) {
        Seq.empty[File]
      } else {
        Files.createDirectories(outPath)
        val mdFiles = Files.walk(blogDir).iterator().asScala.filter(_.toString.endsWith(".md")).toList
        val created = scala.collection.mutable.ListBuffer.empty[String]
        for (p <- mdFiles) {
          val content = new String(Files.readAllBytes(p))
          val fileBase = p.getFileName.toString.replaceAll("\\.md$", "")
          var i = 0
          for (m <- ScalaFence.findAllMatchIn(content)) {
            i += 1
            val infoRaw = Option(m.group(1)).getOrElse("")
            val code = m.group(2).trim
            val info = parseInfo(infoRaw)

            val exampleIdOpt = info.get("example")
            val fileParamOpt = info.get("file")

            val objNameBase = (exampleIdOpt, fileParamOpt) match {
              case (Some(ex), Some(f)) => ex.replaceAll("[^A-Za-z0-9]", "_") + "_" + f.replaceAll("[^A-Za-z0-9]", "_").replaceAll("\\.scala$", "")
              case (Some(ex), None)    => ex.replaceAll("[^A-Za-z0-9]", "_") + "_" + i
              case (None, Some(f))     => fileBase.replaceAll("[^A-Za-z0-9]", "_") + "_" + f.replaceAll("[^A-Za-z0-9]", "_").replaceAll("\\.scala$", "")
              case _                   => fileBase.replaceAll("[^A-Za-z0-9]", "_") + "_" + i
            }

            if (looksLikeFullFile(code)) {
              val rawFilename = outPath.resolve(s"${objNameBase}_raw.scala")
              Files.write(rawFilename, code.getBytes)
              val wrapperName = objNameBase + "_wrapper"
              val wrapper = s"package examples.generated\\n\\nobject ${wrapperName} {\\n  def run(): Unit = { () }\\n}\\n"
              val wrapperFile = outPath.resolve(s"${wrapperName}.scala")
              Files.write(wrapperFile, wrapper.getBytes)
              created += wrapperName
            } else {
              val objName = objNameBase
              val wrapped = s"package examples.generated\\n\\nobject ${objName} {\\n  def run(): Unit = {\\n${code.linesIterator.map(l => "    " + l).mkString("\\n")}\\n  }\\n}\\n"
              val filename = outPath.resolve(s"${objName}.scala")
              Files.write(filename, wrapped.getBytes)
              created += objName
            }
          }
        }

        // write AllSnippets
        if (created.nonEmpty) {
          val all = outPath.resolve("AllSnippets.scala")
          val calls = created.map(n => s"    ${n}.run()").mkString("\n")
          val allContent = s"package examples.generated\\n\\nobject AllSnippets {\\n  def runAll(): Unit = {\\n${calls}\\n  }\\n}\\n"
          Files.write(all, allContent.getBytes)
        }

        val files = Files.list(outPath).iterator().asScala.map(_.toFile).toSeq
        files
      }
    }.taskValue
  )

lazy val rootWithExamples = root.aggregate(examples).dependsOn()