exports.layer_handler = async function (event, context) {
    // TODO implement
     //inject chaos 
    await inject_chaos();
    
    //get ssm param wih old param details
    const { SSMClient,GetParameterCommand } = require("@aws-sdk/client-ssm");
    
    const region = process.env.AWS_REGION;
    
    const ssm = new SSMClient({ region: region });
    
    const FUNCTION_NAME = process.env.AWS_LAMBDA_FUNCTION_NAME;
    console.log(FUNCTION_NAME);
    console.log(region);
    
    var    paramname = '/ChaosInjection/' + FUNCTION_NAME +  '_handler_ssmparam'
    var param  = {
        Name: paramname 
        } ;
    const command = new GetParameterCommand(param);
    const res = await ssm.send(command);
    var old_handler = res.Parameter.Value
    console.log(old_handler);
   
   //now invoke the old handler 
   //find the old handler and module
   var modulename = old_handler.split('.');
   
   var importedModule = require(modulename[0]+ '.js');
   const userHandler = importedModule[modulename[1]];
    
    var orignal_res =  userHandler.apply(event, context);
    
   

    return orignal_res;
};

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  };
  
async function inject_chaos()
{
  //inject chaos 
    console.log(' ******* Starting chaos injection *******')
    msDelay = Math.floor(Math.random() * 3000)
    if (msDelay % 4 == 0)
    {
        console.log('Chaos injected failure');
        process.exit(1);
    }
    else
    {
        console.log ('Injecting delay for ' + msDelay + ' ms' );
        await delay(msDelay);
    }  ;
};