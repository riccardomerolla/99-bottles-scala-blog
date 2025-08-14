package examples

import zio._

object HelloWorld {
  // Exposed program so tests can run the effect directly without requiring
  // ZIOAppArgs / Scope that come with ZIOAppDefault
  val program: ZIO[Console, Throwable, Unit] =
    for {
      _ <- Console.printLine("Hello, what's your name?")
      name <- Console.readLine
      _ <- Console.printLine(s"Hello, $name, welcome to ZIO!")
    } yield ()
}

// Note: we intentionally do not provide a ZIOAppDefault here because
// `HelloWorld.program` requires a `Console` environment. Tests use
// `ZIOSpecDefault` which provides a `TestConsole` automatically.