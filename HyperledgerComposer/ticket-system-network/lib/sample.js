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

    // Create Ticket
    var ticket = factory.newResource(NS, 'Ticket', 'TICK_001');
    ticket.status = 'OPEN';
    ticket.subject = 'Example Ticket';
    ticket.description = 'This is your first ticket. You will see the body of the email received in this section.';
    ticket.technician = factory.newRelationship(NS, 'Technician', 'support@org.com');
    ticket.client = factory.newRelationship(NS, 'Client', 'client@org.com');
    var now = setupSystem.timestamp;
    ticket.openTime = now;
    ticket.updateTime = now;

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

 }


/**
 * Creates a new ticket in the system.
 * @param {org.openticket.CreateTicket} createTicket
 * @transaction
 */
// Work on this
function createTicket(createTicket) {
    var factory = getFactory();
    var NS = 'org.openticket';

    var ticket = factory.newResource(NS, 'Ticket', 'TICK_001');
    ticket.status = 'OPEN';
    ticket.subject = '';
    ticket.description = '';
    ticket.technician = factory.newRelationship(NS, 'Technician', '');
    ticket.client = factory.newRelationship(NS, 'Client', '');
    var now = setupSystem.timestamp;
    ticket.openTime = now;
    ticket.updateTime = now;

    return
}


/**
 * Updates a selected ticket in the system.
 * @param {org.openticket.AddNote} addNote
 * @transaction
 */
// Work on this.
function AddNote(addNote) {
    var ticket = addNote.ticket;
    var newNote = addNote.note;

    if (ticket.notes){
        ticket.notes.push(newNote);
    } else {
        ticket.notes = [newNote]
    }

    var now = addNote.timestamp
    ticket.updateTime = now;
    console.log('[' + now + ']: Note "' + newNote + ' added to ticket ' + ticket + '.');

    return getAssetRegistry('org.openticket')
        .then(function(ticketRegistry){
            return ticketRegistry.update(ticket);
        })
}
