/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global getAssetRegistry getFactory emit */

/**
 * This is the ticket system setup. It will setup the initial ticket system.
 * @param {org.openticket.SetupSystem} setupSystem
 * @transaction
 */

function setupSystem(setupSystem) {

    var factory = getFactory();
    var NS = 'org.openticket';

    // Create Initial Technician
    var tech = factory.newResource(NS, 'Technician', 'support@org.com');
    tech.firstName = 'Devon';
    tech.lastName = 'Rudd';

    // Create Client
    var client = factory.newResource(NS, 'Client', 'client@org.com');
    client.firstName = 'Chester';
    client.lastName = 'Tester';

    // Add Reporting
    // var allTimeReport = factory.newResource(NS, 'AllTimeReport', 'All Time');
    // allTimeReport.ticketsClosed = 0;
    // allTimeReport.ticketsOpened = 0;
    // allTimeReport.avgTimeOpen = 'N/A';
    // allTimeReport.avgTimeUpdated = 'N/A';
    // allTimeReport.openTickets = [];
    // allTimeReport.closedTickets = [];

    // Create Ticket
    var ticket = factory.newResource(NS, 'Ticket', 'TICK_001');
    ticket.status = 'OPEN';
    ticket.subject = 'Example Ticket';
    ticket.description = 'This is your first ticket. You will see the body of the email received in this section.';
    ticket.notes = [];
    ticket.technician = factory.newRelationship(NS, 'Technician', 'support@org.com');
    ticket.client = factory.newRelationship(NS, 'Client', 'client@org.com');
    var now = setupSystem.timestamp;
    ticket.openTime = now;
   
    // Update Network   
    return getParticipantRegistry(NS + '.Technician')
        .then(function (techRegistry){
            return techRegistry.addAll([tech]);
        })
        .then(function(){
            return getParticipantRegistry(NS + '.Client');
        })
        .then(function(clientRegistry){
            return clientRegistry.addAll([client]);
        })
        .then(function(){
            return getAssetRegistry(NS + '.Ticket');
        })
        .then(function(ticketRegistry){
            return ticketRegistry.addAll([ticket]);
        })
   		.then(function(){
      		return getAssetRegistry(NS + '.AllTimeReport');
    	})
		// .then(function(allTimeReportRegistry){
        //     return allTimeReportRegistry.addAll([allTimeReport])
        // })

 }


// /**
//  * Creates a new ticket in the system.
//  * @param {org.openticket.CreateTicket} createTicket
//  * @transaction
//  */

// function createTicket(createTicket) {
//     var factory = getFactory();
//     var NS = 'org.openticket';

//     var ticket = factory.newResource(NS, 'Ticket', createTicket.ticketId);
//     ticket.status = createTicket.ticket.status;
//     ticket.subject = createTicket.ticket.subject;
//     ticket.description = createTicket.ticket.description;
//     ticket.notes = createTicket.ticket.notes;
//     ticket.technician = factory.newRelationship(NS, 'Technician', createTicket.ticket.technician);
//     ticket.client = factory.newRelationship(NS, 'Client', createTicket.ticket.client);
//     ticket.openTime = setupSystem.timestamp;
//     // console.log('[' + now + ']: Created ticket ' + ticket.ticketId + '.');

//     // Reporting
//     // var allTimeReport = "resource:org.openticket.AllTimeReport#AllTime";
//     // allTimeReport.ticketsOpened++;
//     // allTimeReport.openTickets.push(ticket.ticketId);

//     return getAssetRegistry(NS + '.Ticket')
//         .then(function(ticketRegistry){
//             return ticketRegistry.addAll([ticket]);
//         })
//         // .then(function(reportingRegistry){
//         //     return reportingRegistry.update(allTimeReport);
//         // })
// }


/**
 * Adds a note to a selected ticket in the system.
 * @param {org.openticket.AddNote} addNote
 * @transaction
 */

function addNote(addNote) {
    var ticket = addNote.ticket;
    var newNote = addNote.note;
    ticket.notes = [newNote];
    ticket.status = "UPDATED";
    ticket.updateTime = addNote.timestamp;
    // console.log('[' + ticket.updateTime + ']: Note "' + newNote + ' added to ticket ' + ticket + '.');

    return getAssetRegistry('org.openticket.Ticket')
        .then(function(ticketRegistry){
            return ticketRegistry.update(ticket);
        })
}


/**
 * Adds a note to a selected ticket in the system.
 * @param {org.openticket.AddReply} addReply
 * @transaction
 */

function addReply(addReply) {
    var ticket = addReply.ticket;
    var newReply = addReply.reply;
    ticket.replyThread = [newReply];
    ticket.status = "UPDATED";
    ticket.isAnswered = true;
    ticket.updateTime = addReply.timestamp;
    // console.log('[' + ticket.updateTime + ']: Note "' + newNote + ' added to ticket ' + ticket + '.');

    return getAssetRegistry('org.openticket.Ticket')
        .then(function(ticketRegistry){
            return ticketRegistry.update(ticket);
        })
} 


/**
 * Assigns selected Ticket to Technician
 * @param {org.openticket.AssignTicket} assignTicket
 * @transaction
 */

function assignTicket(assignTicket) {
    var ticket = assignTicket.ticket;
    ticket.technician = assignTicket.technician;
    ticket.status = "UPDATED";
    ticket.updateTime = assignTicket.timestamp;

    return getAssetRegistry('org.openticket.Ticket')
        .then(function(ticketRegistry){
            return ticketRegistry.update(ticket);
        })
 }


/**
 * Assigns selected Ticket to Technician
 * @param {org.openticket.ChangeClient} changeClient
 * @transaction
 */

function changeClient(changeClient) {
    var ticket = changeClient.ticket;
    ticket.client = changeClient.client;
    ticket.status = "UPDATED";
    ticket.updateTime = changeClient.timestamp;

    return getAssetRegistry('org.openticket.Ticket')
        .then(function(ticketRegistry){
            return ticketRegistry.update(ticket);
        })
 }


/**
 * Change the subject of selected ticket
 * @param {org.openticket.ChangeSubject} changeSubject
 * @transaction
 */

function changeSubject(changeSubject) {
    var ticket = changeSubject.ticket;
    ticket.subject = changeSubject.subject;
    ticket.status = "UPDATED";
    ticket.updateTime = changeClient.timestamp;

    return getAssetRegistry('org.openticket.Ticket')
        .then(function(ticketRegistry){
            return ticketRegistry.update(ticket);
        })
}


/**
 * Closes a selected ticket in the system.
 * @param {org.openticket.CloseTicket} closeTicket
 * @transaction
 */

function closeTicket(closeTicket) {
    var ticket = closeTicket.ticket;
    ticket.status = "CLOSED";
    ticket.closedTime = closeTicket.timestamp;

    return getAssetRegistry('org.openticket.Ticket')
        .then(function(ticketRegistry){
            return ticketRegistry.update(ticket);
        })
}

