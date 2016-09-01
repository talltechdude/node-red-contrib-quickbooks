module.exports = function(RED) {
	
    function Quickbooks(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var QuickBooksApi = require('node-quickbooks')

        try {
        	this.on('input', function(msg) {
        	    
        	    var configuration = RED.nodes.getNode(config.configuration);
                            
                    var consumerKey = configuration.consumerKey;
                    var consumerSecret = configuration.consumerSecret;
                    var oauthToken = configuration.oauthToken;
                    var oauthTokenSecret = configuration.oauthTokenSecret;
                    var realmId = configuration.realmId;
                    var sandbox;
                    
                    var method = config.method;
    
                    var production = true;
                    if (configuration.destination) { 
                        if(configuration.destination == 'Production'){
                    		sandbox = false;
                        }
                        else{
                    		sandbox = true;
                        }
                    }
                    
                    var qbo = new QuickBooksApi(consumerKey, consumerSecret, oauthToken, oauthTokenSecret, realmId, sandbox, true);
                    
                    var thisNode = this;
                    
                    thisNode.status({fill:"green",shape:"dot",text:"working..."});
                    
                    qbo[method](msg.payload, function(err, response) {
                	
                	thisNode.status({});
                	var payload = {};
                	if(err){
                	    payload.error = err;
                	}
                	if(response){
                	    payload.response = response;
                	}
                	msg.payload = payload;
                        node.send(msg);
                    })
                                
        	});
        }
    	catch(e){
    		node.error("Ops, there is an error...!", msg);
        }
    }
    
    function QuickbooksConfiguration(n) {
	
        RED.nodes.createNode(this,n);
        this.name = n.name;
        this.consumerKey = n.consumerKey;
        this.consumerSecret = n.consumerSecret;
        this.oauthToken = n.oauthToken;
        this.oauthTokenSecret = n.oauthTokenSecret;
        this.realmId = n.realmId;
        this.destination = n.destination;
    }
    
    RED.nodes.registerType("quickbooks",Quickbooks);
    RED.nodes.registerType("quickbooks-configuration",QuickbooksConfiguration);
}
