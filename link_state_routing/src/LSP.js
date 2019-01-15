module.exports = class LSP {

    constructor(id, sequenceNumber, routingTable) {
        this.id = id;
        this.sequenceNumber = sequenceNumber;
        this.routingTable = routingTable;

        this.TTL = 10;
        this.currentFrom = id;
    }

}