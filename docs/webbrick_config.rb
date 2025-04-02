require 'webrick'
require 'webrick/https'
require 'openssl'

cert = OpenSSL::X509::Certificate.new(File.read('localhost.crt'))
pkey = OpenSSL::PKey::RSA.new(File.read('localhost.key'))

options = {
  :SSLEnable => true,
  :SSLVerifyClient => OpenSSL::SSL::VERIFY_NONE,
  :SSLCertificate => cert,
  :SSLPrivateKey => pkey,
  :SSLVerifyDepth => 1,
  :SSLCertName => [["CN", WEBrick::Utils::getservername]]
}

WEBrick::HTTPServer.new(options)
