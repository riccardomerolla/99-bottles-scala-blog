package examples

import zio._
import zio.test._
import zio.test.Assertion._

object HelloWorldSpec extends ZIOSpecDefault {
  def spec = suite("HelloWorld")(
    test("greets the user with their name") {
      for {
        _ <- TestConsole.feedLines("TestUser")
        _ <- HelloWorld.run
        output <- TestConsole.output
      } yield assert(output)(
        exists(containsString("Hello, TestUser"))
      )
    }
  )
}