require_relative 'spec_helper'
require 'fileutils'

RSpec.describe 'book-builder build' do
  it 'runs jekyll build in the book_builder dir' do
    Dir.mktmpdir do |tmp|
      repo_root = File.join(tmp, 'repo')
      bb_dir = File.join(repo_root, 'tools', 'book_builder')
      FileUtils.mkdir_p(bb_dir)
      # create a minimal Gemfile and index
      File.write(File.join(bb_dir, 'Gemfile'), "source 'https://rubygems.org'\n gem 'jekyll'\n")
      # create bin/book-builder script
      bin = File.join(bb_dir, 'bin')
      FileUtils.mkdir_p(bin)
      File.write(File.join(bin, 'book-builder'), "#!/usr/bin/env ruby\nputs 'stub build'\n")
      FileUtils.chmod(0755, File.join(bin, 'book-builder'))

      # monkeypatch repo root resolution
      allow(File).to receive(:expand_path).with('../../../', anything).and_return(repo_root)

      cli = BookBuilder::CLI.new
      expect { cli.build }.not_to raise_error
    end
  end
end
