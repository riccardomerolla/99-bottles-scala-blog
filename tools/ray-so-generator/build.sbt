ThisBuild / scalaVersion := "2.13.10"
ThisBuild / organization := "com.riccardomerolla"

val zioVersion = "2.0.15"

lazy val raysoGenerator = (project in file("."))
  .settings(
    name := "ray-so-generator",
    libraryDependencies ++= Seq(
      "dev.zio" %% "zio" % zioVersion,
      "dev.zio" %% "zio-streams" % zioVersion,
      // You'll need a library for markdown parsing and puppeteer-like functionality
      "org.commonmark" % "commonmark" % "0.21.0",
      "com.microsoft.playwright" % "playwright" % "1.36.0"
    ),
    Compile / mainClass := Some("ConvertToRay")
  )
