import UserManager from "../dao/mongo/manager/UserManagerMongo.js";
import UserService from "./user.service.js";

import CartManager from "../dao/mongo/manager/CartManagerMongo.js";
import CartService from "./cart.service.js";

import TicketManager from "../dao/mongo/manager/TicketManagerMongo.js";
import TicketService from "./ticket.service.js";

export const userService = new UserService(new UserManager());

export const cartService = new CartService(new CartManager());

export const ticketsService = new TicketService(new TicketManager());