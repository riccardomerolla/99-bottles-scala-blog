import java.nio.file.{Files, Paths}
import scala.jdk.CollectionConverters._
import scala.util.matching.Regex

object CodeExtractor {
  // match optional info string after ```scala, capture info and code
  private val ScalaFence: Regex = "(?s)```scala(?:\\s+(.*?))?\\s*(.*?)```".r

  private def safeName(base: String): String =
    base.replaceAll("[^A-Za-z0-9]", "_")

  private def parseInfo(info: String): Map[String, String] = {
    if (info == null) Map.empty
    else
      info.split("\\s+").toList.flatMap { token =>
        token.split("=", 2) match {
          case Array(k, v) => Some(k -> v)
          case _            => None
        }
      }.toMap
  }

  private def looksLikeFullFile(code: String): Boolean = {
    code.linesIterator.map(_.trim).find(_.nonEmpty) match {
      case Some(line) =>
        line.startsWith("package ") || line.startsWith("object ") || line.startsWith("class ") || line.startsWith("trait ")
      case None => false
    }
  }

  private def indent(code: String): String =
    code.linesIterator.map(l => "    " + l).mkString("\n")

  def extractFromFile(mdPath: String, outDir: String, prefix: String = "Snippet"): Int = {
    val content = new String(Files.readAllBytes(Paths.get(mdPath)))
    val matches = ScalaFence.findAllMatchIn(content).toList
    if (matches.isEmpty) return 0

    Files.createDirectories(Paths.get(outDir))
    val fileBaseRaw = Paths.get(mdPath).getFileName.toString
    val fileBase = fileBaseRaw.replaceAll("\\.md$", "")
    var i = 0
    val created = scala.collection.mutable.ListBuffer.empty[String]
    for (m <- matches) {
      i += 1
      val infoRaw = Option(m.group(1)).getOrElse("")
      val code = m.group(2).trim
      val info = parseInfo(infoRaw)

      val exampleIdOpt = info.get("example")
      val fileParamOpt = info.get("file")

      val objNameBase = (exampleIdOpt, fileParamOpt) match {
        case (Some(ex), Some(f)) => safeName(ex) + "_" + safeName(f.replaceAll("\\.scala$", ""))
        case (Some(ex), None)    => safeName(ex) + "_" + i
        case (None, Some(f))     => safeName(fileBase) + "_" + safeName(f.replaceAll("\\.scala$", ""))
        case _                   => safeName(fileBase) + "_" + i
      }

      if (looksLikeFullFile(code)) {
        // write raw file
        val rawFilename = Paths.get(outDir, s"${objNameBase}_raw.scala")
        Files.write(rawFilename, code.getBytes)
        // add a small wrapper so AllSnippets has a run() to call
        val wrapperName = objNameBase + "_wrapper"
        val wrapper = s"package examples.generated\n\nobject ${wrapperName} {\n  def run(): Unit = { () }\n}\n"
        val wrapperFile = Paths.get(outDir, s"${wrapperName}.scala")
        Files.write(wrapperFile, wrapper.getBytes)
        created += wrapperName
      } else {
        val objName = objNameBase
        val wrapped = s"package examples.generated\n\nobject ${objName} {\n  def run(): Unit = {\n${indent(code)}\n  }\n}\n"
        val filename = Paths.get(outDir, s"${objName}.scala")
        Files.write(filename, wrapped.getBytes)
        created += objName
      }
    }

    // update AllSnippets.scala
    if (created.nonEmpty) {
      val all = Paths.get(outDir, "AllSnippets.scala")
      val calls = created.map(n => s"    ${n}.run()").mkString("\n")
      val allContent = s"package examples.generated\n\nobject AllSnippets {\n  def runAll(): Unit = {\n${calls}\n  }\n}\n"
      Files.write(all, allContent.getBytes)
    }

    matches.size
  }

  def main(args: Array[String]): Unit = {
    if (args.length < 2) {
      println("Usage: CodeExtractor <markdown-dir|file> <out-dir>")
      sys.exit(2)
    }
    val src = args(0)
    val out = args(1)
    val p = Paths.get(src)
    val files = if (Files.isDirectory(p)) {
      Files.walk(p).iterator().asScala.filter(_.toString.endsWith(".md")).toList
    } else List(p)

    var total = 0
    for (file <- files) {
      total += extractFromFile(file.toString, out)
    }
    println(s"Extracted $total scala snippets to $out")
  }
}
