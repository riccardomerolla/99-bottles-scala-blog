import zio._
import zio.stream._
import zio.Console._
import java.nio.file.{Path, Paths}
import java.io.IOException

object ConvertToRay extends ZIOAppDefault {
  
  // Process a single markdown file
  def processMarkdownFile(filePath: String): ZIO[Any, Throwable, Unit] =
    for {
      _ <- printLine(s"Processing markdown file: $filePath")
      // Implementation for extracting code blocks and generating images would go here
      // This part was not in the selected code
    } yield ()
      .catchAll(error => printLineError(s"Error processing file $filePath: ${error.getMessage}"))
  
  // Process all markdown files in a directory
  def processMarkdownFiles(directory: String): ZIO[Any, Throwable, Unit] = 
    for {
      _ <- printLine(s"Searching for markdown files in: $directory")
      
      // Find markdown files recursively using ZStream
      files <- ZStream.fromJavaStream(
        ZIO.attempt(java.nio.file.Files.walk(Paths.get(directory)))
      ).flatMap(stream => 
        ZStream.fromIterator(stream.iterator())
          .filter(path => path.toString.endsWith(".md"))
          .map(_.toString)
      ).runCollect
      
      _ <- printLine(s"Found ${files.size} markdown files")
      
      // Process each file
      _ <- ZIO.foreachDiscard(files)(processMarkdownFile)
      
      _ <- printLine("Processing complete!")
    } yield ()
      .catchAll(error => printLineError(s"Error processing markdown files: ${error.getMessage}"))
  
  // Main function
  def run =
    for {
      args <- getArgs
      directories = if (args.isEmpty) Chunk("./blog", "./book/src") else args
      _ <- ZIO.foreachDiscard(directories)(processMarkdownFiles)
    } yield ExitCode.success
}
