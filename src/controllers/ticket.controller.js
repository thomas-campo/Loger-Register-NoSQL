import { TicketsService } from "../services/service";

const getTicketsController = async (req, res) => {
    try {
        const tickets = await TicketsService.getTickets()
        return res.sendSuccess(tickets)

    } catch (error) {
        return res.status(500).send(error);
    }
};

const getTicketByIdController = async (req, res) => {
    try {
        const tid = req.params.tid
        if(!tid) return res.status(404);
        const ticket = await TicketsService.getTicketByUserId(tid);
        if(!ticket) return res.status(404);
        return res.sendSuccess(ticket);

    } catch (error) {
        return res.status(500).send(error);
    }
};

const getTicketByUserIdController = async (req, res) => {
    try {
        const uid = req.params.user._id
        if(!uid) return res.status(404);
        const ticket = await TicketsService.getTicketByUserId(uid)
        return res.sendSuccess(ticket)
    } catch (error) {
        return res.status(500).send(error);
    }
};

const postTicketController = async (req, res) => {
    try {
        const cid = req.params.cartID
        const ticketBody = req.body
        const ticket = {
            cart : cid,
            ...ticketBody
        }
        
        return res.sendSuccess(ticket)

    } catch (error) {
        return res.status(500).send(error);
    }
};

const deleteTicketController = async (req, res) => {
    try {
        const tid = req.params.tid;
        if(!tid) return res.status(404);
        const tickets = await TicketsService.deleteTicket(tid)
        return res.sendSuccess(tickets)

    } catch (error) {
        return res.status(500).send(error);
    }
};

const updateTicketController = async (req, res) => {
    try {
        const tid = req.params.tid;
        if(!tid) return res.status(404);
        const ticket = req.params.body
        const tickets = await TicketsService.updateTicket(tid, ticket)
        return res.sendSuccess.send(tickets)

    } catch (error) {
        return res.status(500).send(error);
    }
};

export default {
    getTicketsController,
    getTicketByIdController,
    getTicketByUserIdController,
    postTicketController,
    deleteTicketController,
    updateTicketController,
}