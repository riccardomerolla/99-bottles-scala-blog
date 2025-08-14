require_relative 'spec_helper'
require 'fileutils'

RSpec.describe 'book-builder new-post' do
  it 'creates a new post in the repo blog directory with expected front matter' do
    Dir.mktmpdir do |tmp|
      # simulate repo root
      repo_root = File.join(tmp, 'repo')
      FileUtils.mkdir_p(repo_root)
      FileUtils.mkdir_p(File.join(repo_root, 'tools', 'book_builder', 'templates'))
      # copy template
      src_template = File.expand_path('../../templates/template-post.md', __dir__)
      dest_template = File.join(repo_root, 'tools', 'book_builder', 'templates', 'template-post.md')
      FileUtils.mkdir_p(File.dirname(dest_template))
      if File.exist?(src_template)
        FileUtils.cp(src_template, dest_template)
      else
        File.write(dest_template, "---\ntitle: Your Title Here\n---\n")
      end

      # run create_post with overridden repo root
      cli = BookBuilder::CLI.new
      allow(cli).to receive(:slugify).and_return('ci-test')

      # monkeypatch repo root resolution
      allow(File).to receive(:expand_path).and_call_original
      allow(File).to receive(:expand_path).with('../../../', anything).and_return(repo_root)

      cli.create_post('CI Test')

      created = Dir.glob(File.join(repo_root, 'blog', '*ci-test*.md')).first
      expect(created).not_to be_nil
      content = File.read(created)
      expect(content).to include('CI Test')
    end
  end
end
