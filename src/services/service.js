import UserManager from "../dao/mongo/manager/UserManagerMongo.js";
import UserRepository from "./repository/user.service.js";

import CartManager from "../dao/mongo/manager/CartManagerMongo.js";
import CartRepository from "./repository/cart.service.js";

import TicketManager from "../dao/mongo/manager/TicketManagerMongo.js";
import TicketRepository from "./repository/ticket.service.js";

export const UserService = new UserRepository(new UserManager());

export const CartService = new CartRepository(new CartManager());

export const TicketsService = new TicketRepository(new TicketManager());