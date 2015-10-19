module.exports = (function () {

    var employees = {
        map: [
            {
                key     : "Is Employee",
                property: "isEmployee"
            },
            {
                key     : "Photo",
                property: "imageSrc"
            },
            {
                key     : "Subject",
                property: "subject"
            },
            {
                key     : "First Name",
                property: "name.first"
            },
            {
                key     : "Last Name",
                property: "name.last"
            },
            {
                key     : "Tags",
                property: "tags"
            },
            {
                key     : "Work Address Street",
                property: "workAddress.street"
            },
            {
                key     : "Work Address City",
                property: "workAddress.city"
            },
            {
                key     : "Work Address Zip",
                property: "workAddress.zip"
            },
            {
                key     : "Work Address Country",
                property: "workAddress.country"
            },
            {
                key     : "Work Email",
                property: "workEmail"
            },
            {
                key     : "Personal Email",
                property: "personalEmail"
            },
            {
                key     : "Work Phone Mobile",
                property: "workPhones.mobile"
            },
            {
                key     : "Work Phone",
                property: "workPhones.phone"
            },
            {
                key     : "Skype",
                property: "skype"
            },
            {
                key     : "Office Location",
                property: "officeLocation"
            },
            {
                key     : "Related User",
                property: "relatedUser"
            },
            {
                key     : "Department Name",
                property: "department.name"
            },
            {
                key     : "Job Position Name",
                property: "jobPosition.name"
            },
            {
                key     : "Manager Name",
                property: "manager.name"
            },
            {
                key     : "Related",
                property: "relatedUser"
            },
            {
                key     : "Related",
                property: "relatedUser"
            },
            {
                key     : "Related",
                property: "relatedUser"
            },
            {
                key     : "Related",
                property: "relatedUser"
            },
            {
                key     : "Related",
                property: "relatedUser"
            },
            {
                key     : "Related",
                property: "relatedUser"
            },
            {
                key     : "Related",
                property: "relatedUser"
            },
            {
                key     : "Coach First Name",
                property: "coach.name.first"
            },
            {
                key     : "Coach Last Name",
                property: "coach.name.last"
            },
            {
                key     : "Nationality",
                property: "nationality"
            },
            {
                key     : "Ident No",
                property: "identNo"
            },
            {
                key     : "Passport No",
                property: "passportNo"
            },
            {
                key     : "Bank Account No",
                property: "bankAccountNo"
            },
            {
                key     : "Other Id",
                property: "otherId"
            },
            {
                key     : "Home Address Street",
                property: "homeAddress.street"
            },
            {
                key     : "Home Address City",
                property: "homeAddress.city"
            },
            {
                key     : "Home Address State",
                property: "homeAddress.state"
            },
            {
                key     : "Home Address Zip",
                property: "homeAddress.zip"
            },
            {
                key     : "Home Address Country",
                property: "homeAddress.country"
            },
            {
                key     : "Date Birth",
                property: "dateBirth"
            },
            {
                key     : "Age",
                property: "age"
            },
            {
                key     : "Days For Birth",
                property: "daysForBirth"
            },
            {
                key     : "Next Action",
                property: "nextAction"
            },
            {
                key     : "Source",
                property: "source"
            },
            {
                key     : "Referred By",
                property: "referredBy"
            },
            {
                key     : "Active",
                property: "active"
            },
            {
                key     : "Workflow Name",
                property: "workflow.name"
            },
            {
                key     : "Who Can RW",
                property: "whoCanRW"
            },
            {
                key     : "Other Info",
                property: "otherInfo"
            },
            {
                key     : "Expected Salary",
                property: "expectedSalary"
            },
            {
                key     : "Proposed Salary",
                property: "proposedSalary"
            },
            {
                key     : "Color",
                property: "color"
            },
            {
                key     : "Creation Date",
                property: "creationDate"
            },
            {
                key     : "Created By Date",
                property: "createdBy.date"
            },
            {
                key     : "Created By User",
                property: "createdBy.user.login"
            },
            {
                key     : "Edited By Date",
                property: "editedBy.date"
            },
            {
                key     : "Edited By User",
                property: "editedBy.user.login"
            },
            {
                key     : "Attachments",
                property: "attachments"
            },
            {
                key     : "Contract End Reason",
                property: "contractEnd.reason"
            },
            {
                key     : "Contract End Date",
                property: "contractEnd.date"
            },
            {
                key     : "Marital",
                property: "marital"
            },
            {
                key     : "Gender",
                property: "gender"
            },
            {
                key     : "JobType",
                property: "jobType"
            },
            {
                key     : "Sequence",
                property: "sequence"
            },
            {
                key     : "Is Lead",
                property: "isLead"
            },
            {
                key     : "Facebook",
                property: "social.FB"
            },
            {
                key     : "Linkedin",
                property: "social.LI"
            },
            {
                key     : "Google+",
                property: "social.GP"
            },
            {
                key     : "Hire",
                property: "hire"
            },
            {
                key     : "Fire",
                property: "fire"
            },
            {
                key     : "LastFire",
                property: "lastFire"
            }
            // TODO FIELD "Transferred" HAVE TYPE [JSON]
            /*,
             {
             key     : "Transferred",
             property: "transferred"
             }*/
        ]
    };

    var weTrack = {
        map: [
            {
                key     : "Mon",
                property: "1"
            },
            {
                key     : "Tue",
                property: "2"
            },
            {
                key     : "Wed",
                property: "3"
            },
            {
                key     : "Thu",
                property: "4"
            },
            {
                key     : "Fri",
                property: "5"
            },
            {
                key     : "Sat",
                property: "6"
            },
            {
                key     : "Sun",
                property: "7"
            },
            {
                key     : "Project Name",
                property: "project.projectName"
            },
            {
                key     : "Project Short Desc",
                property: "Project.projectShortDesc"
            },
            {
                key     : "Project Manager",
                property: "Project.projectmanager"
            },
            {
                key     : "Project Start Date",
                property: "Project.StartDate"
            },
            {
                key     : "Project End Date",
                property: "Project.EndDate"
            },
            {
                key     : "Project Target End Date",
                property: "Project.Target End Date"
            },
            {
                key     : "Project Estimated",
                property: "Project.estimated"
            },
            {
                key     : "Project Logged",
                property: "Project.logged"
            },
            {
                key     : "Project Remaining",
                property: "Project.remaining"
            },
            {
                key     : "Project Progress",
                property: "Project.progress"
            },
            {
                key     : "Project Health",
                property: "Project.health"
            },
            {
                key     : "Project Type",
                property: "Project.projecttype"
            },
            {
                key     : "Project Budget Team",
                property: "Project.budget.projectTeam"
            },
            {
                key     : "Project Budget Bonus",
                property: "Project.budget.bonus"
            },
            {
                key     : "Project Budget",
                property: "Project.budget.budget"
            },
            {
                key     : "Project Budget Values",
                property: "Project.budget.projectValues"
            },
            {
                key     : "Project Budget Total",
                property: "Project.budget.budgetTotal"
            },
            {
                key     : "Date By Week",
                property: "dateByWeek"
            },
            {
                key     : "Date By Month",
                property: "dateByMonth"
            },
            {
                key     : "Project Manager Name",
                property: "project.projectmanager.name"
            },
            {
                key     : "Workflow Name",
                property: "project.workflow.name"
            },
            {
                key     : "Workflow Status",
                property: "project.workflow.status"
            },
            {
                key     : "Customer Name",
                property: "project.customer.Name"
            },
            {
                key     : "Employees Name",
                property: "employee.name"
            },
            {
                key     : "Department Name",
                property: "department.departmentName"
            },
            {
                key     : "Year",
                property: "year"
            },
            {
                key     : "Month",
                property: "month"
            },
            {
                key     : "Week",
                property: "week"
            },
            {
                key     : "Worked",
                property: "worked"
            },
            {
                key     : "Rate",
                property: "rate"
            },
            {
                key     : "Revenue",
                property: "revenue"
            },
            {
                key     : "Cost",
                property: "cost"
            },
            {
                key     : "Amount",
                property: "amount"
            },
            {
                key     : "isPaid",
                property: "isPaid"
            },
            {
                key     : "Info Product Type",
                property: "info.productType.name"
            },
            {
                key     : "Info Sale Price",
                property: "info.salePrice"
            },
            {
                key     : "Who Can RW",
                property: "whoCanRW"
            },
            {
                key     : "Creation Date",
                property: "creationDate"
            },
            {
                key     : "Created By Date",
                property: "createdBy.date"
            },
            {
                key     : "Created By User",
                property: "createdBy.user.login"
            },
            {
                key     : "Edited By Date",
                property: "editedBy.date"
            },
            {
                key     : "Edited By User",
                property: "editedBy.user.login"
            }
        ]
    };

    var customers = {

        map: [
            {
                key     : "Type",
                property: "type"
            },
            {
                key     : "Is Owner",
                property: "isOwn"
            },
            {
                key     : "First Name",
                property: "name.first"
            },
            {
                key     : "Last Name",
                property: "name.last"
            },
            {
                key     : "Date Birthday",
                property: "dateBirth"
            },
            {
                key     : "Photo",
                property: "imageSrc"
            },
            {
                key     : "Email",
                property: "email"
            },
            {
                key     : "Company",
                property: "company"
            },
            {
                key     : "Department",
                property: "department"
            },
            {
                key     : "Timezone",
                property: "timezone"
            },
            {
                key     : "Address Street",
                property: "address.street"
            },
            {
                key     : "Address City",
                property: "address.city"
            },
            {
                key     : "Address State",
                property: "address.state"
            },
            {
                key     : "Address Zip",
                property: "address.zip"
            },
            {
                key     : "Address Country",
                property: "address.country"
            },
            {
                key     : "Website",
                property: "website"
            },
            {
                key     : "Job Position",
                property: "jobPosition"
            },
            {
                key     : "Skype",
                property: "skype"
            },
            {
                key     : "Phone",
                property: "phones.phone"
            },
            {
                key     : "Mobile",
                property: "phones.mobile"
            },
            {
                key     : "Fax",
                property: "phones.fax"
            },
            {
                key     : "Contacts",
                property: "contacts"
            },
            {
                key     : "Internal Notes",
                property: "internalNotes"
            },
            {
                key     : "Title",
                property: "title"
            },
            {
                key     : "Sales Purchases Is Customer",
                property: "salesPurchases.isCustomer"
            },
            {
                key     : "Sales Purchases Is Supplier",
                property: "salesPurchases.isSupplier"
            },
            {
                key     : "Sales Purchases Sales Person",
                property: "salesPurchases.salesPerson"
            },
            {
                key     : "Sales Purchases Sales Team",
                property: "salesPurchases.salesTeam"
            },
            {
                key     : "Sales Purchases Implemented By",
                property: "salesPurchases.implementedBy"
            },
            {
                key     : "Sales Purchases Active",
                property: "salesPurchases.active"
            },
            {
                key     : "Sales Purchases Reference",
                property: "salesPurchases.reference"
            },
            {
                key     : "Sales Purchases Language",
                property: "salesPurchases.language"
            },
            {
                key     : "Sales Purchases Receive Messages",
                property: "salesPurchases.receiveMessages"
            },
            {
                key     : "Related User",
                property: "relatedUser"
            },
            {
                key     : "Color",
                property: "color"
            },
            {
                key     : "Facebook",
                property: "social.FB"
            },
            {
                key     : "Linkedin",
                property: "social.LI"
            },
            {
                key     : "Who Can RW",
                property: "whoCanRW"
            },
            {
                key     : "Groups Owner",
                property: "groups.owner"
            },
            {
                key     : "Groups Users",
                property: "groups.users"
            },
            {
                key     : "Groups",
                property: "groups.Group"
            },
            {
                key     : "Notes",
                property: "notes"
            },
            {
                key     : "Attachments",
                property: "attachments"
            },
            {
                key     : "History",
                property: "history"
            },
            {
                key     : "Created By Date",
                property: "createdBy.date"
            },
            {
                key     : "Created By User",
                property: "createdBy.user.login"
            },
            {
                key     : "Edited By Date",
                property: "editedBy.date"
            },
            {
                key     : "Edited By User",
                property: "editedBy.user.login"
            },
            {
                key     : "Company Size",
                property: "companyInfo.size"
            },
            {
                key     : "Company Industry",
                property: "companyInfo.industry"
            }

        ]
    };

    var project = {
        map: [
            {
                key     : "Project Short Desc",
                property: "projectShortDesc"
            },
            {
                key     : "Project Name",
                property: "projectName"
            },
            {
                key     : "Task",
                property: "task"
            },
            {
                key     : "Customer Name",
                property: "customername"
            },
            {
                key     : "Project Manager Name",
                property: "projectmanager.name"
            },
            {
                key     : "Description",
                property: "description"
            },
            {
                key     : "Who Can RW",
                property: "whoCanRW"
            },
            {
                key     : "Groups Owner",
                property: "groups.owner"
            },
            {
                key     : "Groups Users",
                property: "groups.users"
            },
            {
                key     : "Groups",
                property: "groups.Group"
            },
            {
                key     : "Start Date",
                property: "StartDate"
            },
            {
                key     : "End Date",
                property: "EndDate"
            },
            {
                key     : "Target End Date",
                property: "TargetEndDate"
            },
            {
                key     : "Sequence",
                property: "sequence"
            },
            {
                key     : "Parent",
                property: "parent"
            },
            {
                key     : "Workflow Name",
                property: "workflow.name"
            },
            {
                key     : "Estimated",
                property: "estimated"
            },
            {
                key     : "Logged",
                property: "logged"
            },
            {
                key     : "Remaining",
                property: "remaining"
            },
            {
                key     : "Progress",
                property: "progress"
            },
            {
                key     : "Created By Date",
                property: "createdBy.date"
            },
            {
                key     : "Created By User",
                property: "createdBy.user.login"
            },
            {
                key     : "Project Type",
                property: "Project.projecttype"
            },
            {
                key     : "Notes",
                property: "notes"
            },
            {
                key     : "Attachments",
                property: "attachments"
            },
            {
                key     : "Edited By Date",
                property: "editedBy.date"
            },
            {
                key     : "Edited By User",
                property: "editedBy.user.login"
            },
            {
                key     : "Health",
                property: "health"
            }

        ]

        /*

         'bonus.employeeId'   : 'Bonus Employee Id',
         'bonus.bonusId'      : 'Bonus Id',
         'bonus.startDate'    : 'Bonus Start Date',
         'bonus.startWeek'    : 'Bonus Start Week',
         'bonus.startYear'    : 'Bonus Start Year',
         'bonus.endDate'      : 'Bonus End Date',
         'bonus.endWeek'      : 'Bonus End Week',
         'bonus.endYear'      : 'Bonus End Year'
         */

    };

    var product = {
        map: [
            {
                key     : "Name",
                property: "name"
            },
            {
                key     : "Can Be Sold",
                property: "canBeSold"
            },
            {
                key     : "Can Be Expensed",
                property: "canBeExpensed"
            },
            {
                key     : "Event Subscription",
                property: "eventSubscription"
            },
            {
                key     : "Can Be Purchased",
                property: "canBePurchased"
            },
            {
                key     : "Photo",
                property: "imageSrc"
            },
            {
                key     : "Info Product Type",
                property: "info.productType.name"
            },
            {
                key     : "Info Sale Price",
                property: "info.salePrice"
            },
            {
                key     : "Info Is Active",
                property: "info.isActive"
            },
            {
                key     : "Info Barcode",
                property: "info.barcode"
            },
            {
                key     : "Info Description",
                property: "info.description"
            },
            {
                key     : "Accounting Category Name",
                property: "accounting.category.name"
            },
            {
                key     : "Workflow Name",
                property: "workflow.name"
            },
            {
                key     : "wTrack Who Can RW",
                property: "wTrack.whoCanRW"
            },
            {
                key     : "Groups Owner",
                property: "groups.owner"
            },
            {
                key     : "Groups Users",
                property: "groups.users"
            },
            {
                key     : "Groups",
                property: "groups.Group"
            },
            {
                key     : "Creation Date",
                property: "creationDate"
            },
            {
                key     : "Created By Date",
                property: "createdBy.date"
            },
            {
                key     : "Created By User",
                property: "createdBy.user.login"
            },
            {
                key     : "Edited By Date",
                property: "editedBy.date"
            },
            {
                key     : "Edited By User",
                property: "editedBy.user.login"
            },
            {
                key     : "wTrack Date By Week",
                property: "wTrack.dateByWeek"
            },
            {
                key     : "wTrack Date By Month",
                property: "wTrack.dateByMonth"
            },
            {
                key     : "wTrack Project Manager Name",
                property: "wTrack.project.projectmanager.name"
            },
            {
                key     : "wTrack Workflow Name",
                property: "wTrack.project.workflow.name"
            },
            {
                key     : "wTrack Workflow Status",
                property: "wTrack.project.workflow.status"
            },
            {
                key     : "wTrack Customer Name",
                property: "wTrack.project.customer.Name"
            },
            {
                key     : "wTrack Employees Name",
                property: "wTrack.employee.name"
            },
            {
                key     : "wTrack Department Name",
                property: "wTrack.department.departmentName"
            },
            {
                key     : "wTrack Year",
                property: "wTrack.year"
            },
            {
                key     : "wTrack wTrack Month",
                property: "wTrack.month"
            },
            {
                key     : "wTrack Week",
                property: "wTrack.week"
            },
            {
                key     : "wTrack Worked",
                property: "wTrack.worked"
            },
            {
                key     : "wTrack Rate",
                property: "wTrack.rate"
            },
            {
                key     : "wTrack Revenue",
                property: "wTrack.revenue"
            },
            {
                key     : "wTrack Cost",
                property: "wTrack.cost"
            },
            {
                key     : "wTrack Amount",
                property: "wTrack.mount"
            },
            {
                key     : "wTrack isPaid",
                property: "wTrack.isPaid"
            },
            {
                key     : "wTrack Info Product Type",
                property: "wTrack.info.productType.name"
            },
            {
                key     : "wTrack Info Sale Price",
                property: "wTrack.info.salePrice"
            },
            {
                key     : "wTrack Who Can RW",
                property: "wTrack.whoCanRW"
            },
            {
                key     : "wTrack Creation Date",
                property: "wTrack.creationDate"
            },
            {
                key     : "wTrackCreated By Date",
                property: "wTrack.createdBy.date"
            },
            {
                key     : "wTrack Created By User",
                property: "wTrack.createdBy.user.login"
            },
            {
                key     : "wTrack Edited By Date",
                property: "wTrack.editedBy.date"
            },
            {
                key     : "wTrack Edited By User",
                property: "wTrack.editedBy.user.login"
            }
        ]
    };

    return {
        Employees: employees,
        WTrack   : weTrack,
        Customers: customers,
        Project  : project,
        Product  : product
    }

})();