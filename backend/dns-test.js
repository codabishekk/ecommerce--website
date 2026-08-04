const dns = require('dns').promises;

async function testDns() {
    const srvRecord = '_mongodb._tcp.cluster0.wrdq4oa.mongodb.net';
    console.log(`Resolving SRV for: ${srvRecord}`);
    try {
        const addresses = await dns.resolveSrv(srvRecord);
        console.log('SRV Records found:', JSON.stringify(addresses, null, 2));
        
        for (const addr of addresses) {
            console.log(`Resolving A record for: ${addr.name}`);
            try {
                const ips = await dns.resolve4(addr.name);
                console.log(`IPs for ${addr.name}:`, ips);
            } catch (e) {
                console.error(`Failed to resolve A record for ${addr.name}:`, e.message);
            }
        }
    } catch (err) {
        console.error('DNS Resolve SRV Error:', err);
    }
}

testDns();
