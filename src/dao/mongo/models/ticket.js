import mongoose from 'mongoose';

const collection = 'tickets';

const ticketSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    code:String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    },
    amount:Number,
    purchaser:String

}, { timestamps: { createdAt: 'purchase_time', updatedAt: 'updated_at' } }
);

// ticketSchema.pre('save', async function (next) {

//     if (this.isNew) {
//         try {

//             const user = await this.model('Users').findById(this.user);

//             this.purchaser = user.email;

//             const count = await this.model('Tickets').countDocuments();

//             this.code = `${user.email}.${count + 1}/${this._id}`;
//             console.log(this.code);
            
//             this.count = count + 1;
            

//             next();

//         } catch (err) {
//             next(err);
//         }
//     } else {
//         next();
//     }
// });




export const ticketModel = model(collection, ticketSchema)