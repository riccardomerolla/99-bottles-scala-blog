module BookBuilder
  module Plugins
    module RaySo
      def self.generate_for_file(md_path)
        return unless ENV['ENABLE_RAY_SO'] == '1'
        legacy = File.expand_path('../../../../tools/legacy/convert-to-carbon.ts', __dir__)

        if File.exist?(legacy)
          puts "Running legacy TypeScript converter for #{md_path}"
          system("npx ts-node #{legacy} #{md_path}")
        else
          puts "No legacy converter found; trying carbon-now or other CLI"
          # Attempt to call carbon-now or other tool; this is a best-effort fallback.
          system("npx carbon-now #{md_path} --save-to #{File.dirname(md_path)}")
        end
      end
    end
  end
end
