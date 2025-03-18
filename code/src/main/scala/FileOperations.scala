package examples

import zio._
import java.io.IOException
import java.nio.file.{Paths, Files}

object FileOperations {
  def readFile(file: String): ZIO[Any, IOException, String] =
    ZIO.attempt(scala.io.Source.fromFile(file).mkString).refineToOrDie[IOException]

  def writeFile(file: String, content: String): ZIO[Any, IOException, Unit] =
    ZIO.attempt(Files.write(Paths.get(file), content.getBytes())).unit.refineToOrDie[IOException]

  val program: ZIO[Any, IOException, Unit] = for {
    content <- readFile("input.txt")
    transformedContent = content.toUpperCase
    _ <- writeFile("output.txt", transformedContent)
  } yield ()
}