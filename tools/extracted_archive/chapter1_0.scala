import zio._

// An effect that requires Console, might fail with IOException, and produces a String
val readLine: ZIO[Console, IOException, String] = Console.readLine
