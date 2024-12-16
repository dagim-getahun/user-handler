// Methods to route function calls through API calls
class FunctionCallRouter {
  // Main router method that handles requests and executes the desired function
  async CallRouter(req: any, res: any) {
    try {
      const response = await this.executeFunctionByName(
        req.methodToCall,
        req.functionArgument
      );
      if (response) {
        res.json(response);
      } else {
        res.status(404).json({ error: "Function not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error", details: error });
    }
  }

  // Method to dynamically call the function based on the function name
  async executeFunctionByName(functionName: string, body: Record<string, any>) {
    if (typeof (this as any)[functionName] === "function") {
      try {
        const result = await (this as any)[functionName](body);
        return result;
      } catch (error) {
        console.error(`Error executing function ${functionName}:`, error);
        throw error;
      }
    } else {
      console.error(`Function ${functionName} does not exist.`);
      return null;
    }
  }
}

export default FunctionCallRouter;
