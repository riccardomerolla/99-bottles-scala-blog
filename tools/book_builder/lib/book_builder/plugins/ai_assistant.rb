module BookBuilder
  module Plugins
    module AIAssistant
      def self.run_if_enabled(args = [])
        return unless ENV['ENABLE_AI_ASSISTANT'] == '1'
        py = File.expand_path('../../../../ai-assistant/generate_content.py', __dir__)
        unless File.exist?(py)
          puts "AI assistant script not found at #{py}. See tools/legacy for archived scripts."
          return
        end

        cmd = "python3 #{py} #{args.join(' ')}"
        puts "Running AI assistant: #{cmd}"
        system(cmd)
      end
    end
  end
end
