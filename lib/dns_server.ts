import { Server } from 'dnsserver';

const NS_T_A = 1;
const NS_C_IN = 1; 
const NS_RCODE_NXDOMAIN = 3;

interface Configuration {
  dnsDomainPattern: RegExp;
}

interface DNSRequest {
  question: {
    type: number;
    class: number;
    name: string;
  }
}

class DnsServer extends Server {

  configuration: Configuration;

  constructor(configuration: Configuration) {
    super();
    this.configuration = configuration;
    this.on('request', this.handleRequest); 
  }

  listen(port: number, callback: () => void) {
    this.bind(port);
    if (callback) {
      callback();
    }
  }

  handleRequest(req: DNSRequest, res: any) {
    const { question } = req;
    const { dnsDomainPattern } = this.configuration;

    if (question.type === NS_T_A && 
        question.class === NS_C_IN &&
        dnsDomainPattern.test(question.name)) {
        
      res.addRR(question.name, NS_T_A, NS_C_IN, 600, '127.0.0.1');
    
    } else {
      res.header.rcode = NS_RCODE_NXDOMAIN; 
    }

    res.send();
  }

}

export = DnsServer;
