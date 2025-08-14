require 'fileutils'
require 'front_matter_parser'
require 'tty-command'
begin
  require_relative 'book_builder/plugins/ai_assistant'
rescue LoadError
  # optional plugin
end
begin
  require_relative 'book_builder/plugins/ray_so'
rescue LoadError
  # optional plugin
end

module BookBuilder
  class CLI
    TEMPLATE = File.expand_path('../../templates/template-post.md', __dir__)

    def create_post(title)
      now = Time.now.utc.strftime('%Y-%m-%d')
      filename = "#{now}-#{slugify(title)}.md"
      dest = File.join(Dir.pwd, 'blog', filename)

      FileUtils.mkdir_p(File.dirname(dest))
      content = File.read(TEMPLATE)
      content = content.sub('Your Title Here', title)
      File.write(dest, content)
      puts "Created: #{dest}"
    end

    def build
      cmd = TTY::Command.new
      puts 'Building site with Jekyll...'
      cmd.run('bundle exec jekyll build')
    end

    private

    def slugify(text)
      text.downcase.gsub(/[^a-z0-9]+/, '-').gsub(/^-|-$/, '')
    end
  end
end
