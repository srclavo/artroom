require 'webrick'

port = ENV['PORT'] || 3000
server = WEBrick::HTTPServer.new(
  Port: port.to_i,
  DocumentRoot: File.dirname(__FILE__),
  Logger: WEBrick::Log.new($stdout, WEBrick::Log::INFO),
  AccessLog: [[File.open(File::NULL, 'w'), WEBrick::AccessLog::COMMON_LOG_FORMAT]]
)

trap('INT') { server.shutdown }
trap('TERM') { server.shutdown }

puts "ArtRoom running at http://localhost:#{port}"
puts "Open http://localhost:#{port}/artroom-home.html"
server.start
