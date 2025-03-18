package examples

import zio._

object HelloWorld extends ZIOAppDefault {
  def run = 
    for {
      _ <- Console.printLine("Hello, what's your name?")
      name <- Console.readLine
      _ <- Console.printLine(s"Hello, $name, welcome to ZIO!")
    } yield ()
}