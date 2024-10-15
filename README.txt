User Hander Module 

I Main Purposes 
Add new user
Use Email/Phone and Password or Gmail
Contact confirmation using email/phone number

Edit User Information
Modify user’s data in the database
Modify user’s associated images 
Confirmation for updating fields marked sensitive 

Remove User
Provide option to completely remove from database or just make it inaccessible
Sequential confirmation to get final authorization before deletion  


II Functional Usage

#  import module

Import UserHandler from “user-handler-module”

# Import database connection

Import db from “database-connection”

# Create Instance 

 const HandleUser = new UserHandler(db)

# Methods in the object

const param = {
	# user data
}

AddNewUser(param) 
EditUser(param) 
DeleteUser(param)


III API Call Usage 

Will be using a Access Token for the service and standard http GET/POST requests




IV Return Values

Status 
Modified data 
Error detail on runtime error

{
status: “success”,
data: params 
}

{
status: “failed”,
task:  # failed task (addNewUser/ modifyUser),
errorMessage: #message,
errorStack: #more detail on the error
}


