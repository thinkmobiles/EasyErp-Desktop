module.exports = (function () {

    var employees = {
        map: [
            {
                map     : "Is Employee",
                property: "isEmployee"
            },
            {
                map     : "Photo",
                property: "imageSrc"
            },
            {
                map     : "Subject",
                property: "subject"
            },
            {
                map     : "First Name",
                property: "name.first"
            },
            {
                map     : "Last Name",
                property: "name.last"
            },
            {
                map     : "Tags",
                property: "tags"
            },
            {
                map     : "Work Address Street",
                property: "workAddress.street"
            },
            {
                map     : "Work Address City",
                property: "workAddress.city"
            },
            {
                map     : "Work Address Zip",
                property: "workAddress.zip"
            },
            {
                map     : "Work Address Country",
                property: "workAddress.country"
            },
            {
                map     : "Work Email",
                property: "workEmail"
            },
            {
                map     : "Personal Email",
                property: "personalEmail"
            },
            {
                map     : "Work Phone Mobile",
                property: "workPhones.mobile"
            },
            {
                map     : "Work Phone",
                property: "workPhones.phone"
            },
            {
                map     : "Skype",
                property: "skype"
            },
            {
                map     : "Office Location",
                property: "officeLocation"
            },
            {
                map     : "Related User",
                property: "relatedUser"
            },
            {
                map     : "Department Name",
                property: "department.name"
            },
            {
                map     : "Job Position Name",
                property: "jobPosition.name"
            },
            {
                map     : "Manager Name",
                property: "manager.name"
            },
            {
                map     : "Related",
                property: "relatedUser"
            },
            {
                map     : "Related",
                property: "relatedUser"
            },
            {
                map     : "Related",
                property: "relatedUser"
            },
            {
                map     : "Related",
                property: "relatedUser"
            },
            {
                map     : "Related",
                property: "relatedUser"
            },
            {
                map     : "Related",
                property: "relatedUser"
            },
            {
                map     : "Related",
                property: "relatedUser"
            },
            {
                map     : "Coach First Name",
                property: "coach.name.first"
            },
            {
                map     : "Coach Last Name",
                property: "coach.name.last"
            },
            {
                map     : "Nationality",
                property: "nationality"
            },
            {
                map     : "Ident No",
                property: "identNo"
            },
            {
                map     : "Passport No",
                property: "passportNo"
            },
            {
                map     : "Bank Account No",
                property: "bankAccountNo"
            },
            {
                map     : "Other Id",
                property: "otherId"
            },
            {
                map     : "Home Address Street",
                property: "homeAddress.street"
            },
            {
                map     : "Home Address City",
                property: "homeAddress.city"
            },
            {
                map     : "Home Address State",
                property: "homeAddress.state"
            },
            {
                map     : "Home Address Zip",
                property: "homeAddress.zip"
            },
            {
                map     : "Home Address Country",
                property: "homeAddress.country"
            },
            {
                map     : "Date Birth",
                property: "dateBirth"
            },
            {
                map     : "Age",
                property: "age"
            },
            {
                map     : "Days For Birth",
                property: "daysForBirth"
            },
            {
                map     : "Next Action",
                property: "nextAction"
            },
            {
                map     : "Source",
                property: "source"
            },
            {
                map     : "Referred By",
                property: "referredBy"
            },
            {
                map     : "Active",
                property: "active"
            },
            {
                map     : "Workflow Name",
                property: "workflow.name"
            },
            {
                map     : "Who Can RW",
                property: "whoCanRW"
            },
            {
                map     : "Other Info",
                property: "otherInfo"
            },
            {
                map     : "Expected Salary",
                property: "expectedSalary"
            },
            {
                map     : "Proposed Salary",
                property: "proposedSalary"
            },
            {
                map     : "Color",
                property: "color"
            },
            {
                map     : "Creation Date",
                property: "creationDate"
            },
            {
                map     : "Created By Date",
                property: "createdBy.date"
            },
            {
                map     : "Created By User",
                property: "createdBy.user.login"
            },
            {
                map     : "Edited By Date",
                property: "editedBy.date"
            },
            {
                map     : "Edited By User",
                property: "editedBy.user.login"
            },
            {
                map     : "Attachments",
                property: "attachments"
            },
            {
                map     : "Contract End Reason",
                property: "contractEnd.reason"
            },
            {
                map     : "Contract End Date",
                property: "contractEnd.date"
            },
            {
                map     : "Marital",
                property: "marital"
            },
            {
                map     : "Gender",
                property: "gender"
            },
            {
                map     : "JobType",
                property: "jobType"
            },
            {
                map     : "Sequence",
                property: "sequence"
            },
            {
                map     : "Is Lead",
                property: "isLead"
            },
            {
                map     : "Facebook",
                property: "social.FB"
            },
            {
                map     : "Linkedin",
                property: "social.LI"
            },
            {
                map     : "Google+",
                property: "social.GP"
            },
            {
                map     : "Hire",
                property: "hire"
            },
            {
                map     : "Fire",
                property: "fire"
            },
            {
                map     : "LastFire",
                property: "lastFire"
            },
            {
                map     : "Transferred",
                property: "transferred"
            }
        ]
    };

    var weTrack = {
        map: [
            {
                map     : "Mon",
                property: "1"
            },
            {
                map     : "Tue",
                property: "2"
            },
            {
                map     : "Wed",
                property: "3"
            },
            {
                map     : "Thu",
                property: "4"
            },
            {
                map     : "Fri",
                property: "5"
            },
            {
                map     : "Sat",
                property: "6"
            },
            {
                map     : "Sun",
                property: "7"
            },
            {
                map     : "Project Name",
                property: "project.projectName"
            },
            {
                map     : "Project Short Desc",
                property: "Project.projectShortDesc"
            },
            {
                map     : "Project Manager",
                property: "Project.projectmanager"
            },
            {
                map     : "Project Start Date",
                property: "Project.StartDate"
            },
            {
                map     : "Project End Date",
                property: "Project.EndDate"
            },
            {
                map     : "Project Target End Date",
                property: "Project.Target End Date"
            },
            {
                map     : "Project Estimated",
                property: "Project.estimated"
            },
            {
                map     : "Project Logged",
                property: "Project.logged"
            },
            {
                map     : "Project Remaining",
                property: "Project.remaining"
            },
            {
                map     : "Project Progress",
                property: "Project.progress"
            },
            {
                map     : "Project Health",
                property: "Project.health"
            },
            {
                map     : "Project Type",
                property: "Project.projecttype"
            },
            {
                map     : "Project Budget Team",
                property: "Project.budget.projectTeam"
            },
            {
                map     : "Project Budget Bonus",
                property: "Project.budget.bonus"
            },
            {
                map     : "Project Budget",
                property: "Project.budget.budget"
            },
            {
                map     : "Project Budget Values",
                property: "Project.budget.projectValues"
            },
            {
                map     : "Project Budget Total",
                property: "Project.budget.budgetTotal"
            },
            {
                map     : "Date By Week",
                property: "dateByWeek"
            },
            {
                map     : "Date By Month",
                property: "dateByMonth"
            },
            {
                map     : "Project Manager Name",
                property: "project.projectmanager.name"
            },
            {
                map     : "Workflow Name",
                property: "project.workflow.name"
            },
            {
                map     : "Workflow Status",
                property: "project.workflow.status"
            },
            {
                map     : "Customer Name",
                property: "project.customer.Name"
            },
            {
                map     : "Employees Name",
                property: "employee.name"
            },
            {
                map     : "Department Name",
                property: "department.departmentName"
            },
            {
                map     : "Year",
                property: "year"
            },
            {
                map     : "Month",
                property: "month"
            },
            {
                map     : "Week",
                property: "week"
            },
            {
                map     : "Worked",
                property: "worked"
            },
            {
                map     : "Rate",
                property: "rate"
            },
            {
                map     : "Revenue",
                property: "revenue"
            },
            {
                map     : "Cost",
                property: "cost"
            },
            {
                map     : "Amount",
                property: "amount"
            },
            {
                map     : "isPaid",
                property: "isPaid"
            },
            {
                map     : "Info Product Type",
                property: "info.productType"
            },
            {
                map     : "Info Sale Price",
                property: "info.salePrice"
            },
            {
                map     : "Who Can RW",
                property: "whoCanRW"
            },
            {
                map     : "Creation Date",
                property: "creationDate"
            },
            {
                map     : "Created By Date",
                property: "createdBy.date"
            },
            {
                map     : "Created By User",
                property: "createdBy.user.login"
            },
            {
                map     : "Edited By Date",
                property: "editedBy.date"
            },
            {
                map     : "Edited By User",
                property: "editedBy.user.login"
            }
        ]
    };

    var customers = {

        map: [
            {
                map     : "Type",
                property: "type"
            },
            {
                map     : "Is Owner",
                property: "isOwn"
            },
            {
                map     : "First Name",
                property: "name.first"
            },
            {
                map     : "Last Name",
                property: "name.last"
            },
            {
                map     : "Date Birthday",
                property: "dateBirth"
            },
            {
                map     : "Photo",
                property: "imageSrc"
            },
            {
                map     : "Email",
                property: "email"
            },
            {
                map     : "Company",
                property: "company"
            },
            {
                map     : "Department",
                property: "department"
            },
            {
                map     : "Timezone",
                property: "timezone"
            },
            {
                map     : "Address Street",
                property: "address.street"
            },
            {
                map     : "Address City",
                property: "address.city"
            },
            {
                map     : "Address State",
                property: "address.state"
            },
            {
                map     : "Address Zip",
                property: "address.zip"
            },
            {
                map     : "Address Country",
                property: "address.country"
            },
            {
                map     : "Website",
                property: "website"
            },
            {
                map     : "Job Position",
                property: "jobPosition"
            },
            {
                map     : "Skype",
                property: "skype"
            },
            {
                map     : "Phone",
                property: "phones.phone"
            },
            {
                map     : "Mobile",
                property: "phones.mobile"
            },
            {
                map     : "Fax",
                property: "phones.fax"
            },
            {
                map     : "Contacts",
                property: "contacts"
            },
            {
                map     : "Internal Notes",
                property: "internalNotes"
            },
            {
                map     : "Title",
                property: "title"
            },
            {
                map     : "Sales Purchases Is Customer",
                property: "salesPurchases.isCustomer"
            },
            {
                map     : "Sales Purchases Is Supplier",
                property: "salesPurchases.isSupplier"
            },
            {
                map     : "Sales Purchases Sales Person",
                property: "salesPurchases.salesPerson"
            },
            {
                map     : "Sales Purchases Sales Team",
                property: "salesPurchases.salesTeam"
            },
            {
                map     : "Sales Purchases Implemented By",
                property: "salesPurchases.implementedBy"
            },
            {
                map     : "Sales Purchases Active",
                property: "salesPurchases.active"
            },
            {
                map     : "Sales Purchases Reference",
                property: "salesPurchases.reference"
            },
            {
                map     : "Sales Purchases Language",
                property: "salesPurchases.language"
            },
            {
                map     : "Sales Purchases Receive Messages",
                property: "salesPurchases.receiveMessages"
            },
            {
                map     : "Related User",
                property: "relatedUser"
            },
            {
                map     : "Color",
                property: "color"
            },
            {
                map     : "Facebook",
                property: "social.FB"
            },
            {
                map     : "Linkedin",
                property: "social.LI"
            },
            {
                map     : "Who Can RW",
                property: "whoCanRW"
            },
            {
                map     : "Groups Owner",
                property: "groups.owner"
            },
            {
                map     : "Groups Users",
                property: "groups.users"
            },
            {
                map     : "Groups Owner",
                property: "groups.Group"
            },
            {
                map     : "Notes",
                property: "notes"
            },
            {
                map     : "Attachments",
                property: "attachments"
            },
            {
                map     : "History",
                property: "history"
            },
            {
                map     : "Created By Date",
                property: "createdBy.date"
            },
            {
                map     : "Created By User",
                property: "createdBy.user.login"
            },
            {
                map     : "Edited By Date",
                property: "editedBy.date"
            },
            {
                map     : "Edited By User",
                property: "editedBy.user.login"
            },
            {
                map     : "Company Size",
                property: "companyInfo.size"
            },
            {
                map     : "Edited By User",
                property: "Company Industry"
            }

        ]
    };

    return {
        Employees: employees,
        WTrack   : weTrack,
        Customers: customers
    }

})();