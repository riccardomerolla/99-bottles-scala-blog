import org.scalatest.flatspec.AnyFlatSpec

class GeneratedSnippetsSpec extends AnyFlatSpec {
  "All generated snippets" should "run without throwing" in {
    // If there are no generated snippets this will be a no-op at runtime
    try {
      val cls = Class.forName("examples.generated.AllSnippets")
      val m = cls.getMethod("runAll")
      m.invoke(null)
    } catch {
      case _: ClassNotFoundException => // no generated snippets, test passes
    }
  }
}
