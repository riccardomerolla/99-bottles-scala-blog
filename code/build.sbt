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