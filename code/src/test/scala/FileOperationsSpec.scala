package examples

import zio._
import zio.test._
import zio.test.Assertion._
import java.io.IOException
import java.nio.file.{Files, Paths}

object FileOperationsSpec extends ZIOSpecDefault {
  def spec = suite("FileOperations")(
    test("transforms content to uppercase") {
      val tempInputFile = "test-input.txt"
      val tempOutputFile = "test-output.txt"
      val testContent = "hello world"
      
      for {
        _ <- ZIO.attempt(Files.write(Paths.get(tempInputFile), testContent.getBytes))
          .orDie
        _ <- FileOperations.readFile(tempInputFile)
          .flatMap(content => FileOperations.writeFile(tempOutputFile, content.toUpperCase))
        outputContent <- ZIO.attempt(Files.readString(Paths.get(tempOutputFile)))
          .orDie
        _ <- ZIO.attempt {
          Files.deleteIfExists(Paths.get(tempInputFile))
          Files.deleteIfExists(Paths.get(tempOutputFile))
        }.orDie
      } yield assert(outputContent)(equalTo("HELLO WORLD"))
    }
  )
}