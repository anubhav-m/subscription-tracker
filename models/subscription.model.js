import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minLength: 2,
        maxLength: 100
    },

    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be greater than 0']
    },

    currency: {
        type: String,
        enum: ['USD', 'EUR', 'INR'],
        default: 'INR',
    },

    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        default: 'monthly',
    },

    category: {
        type: String,
        enum: ['entertainment', 'utilities', 'food', 'health', 'education', 'other'],
        default: 'other',
        required: [true, 'Category is required']
    },  
    
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'UPI'],
        default: 'credit_card',
        required: [true, 'Payment method is required']
    },

    status: {
        type: String,
        enum: ['active', 'expired', 'cancelled'],
        default: 'active',
        required: [true, 'Status is required']
    },

    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
        validate: {
            validator: (val)=> val <= new Date(),
            message: 'Start date cannot be in the future'
        }
    },

    renewalDate: {
        type: Date,
        validate: {
            validator: function (val) {return(val > this.startDate)} ,
            message: 'Renewal date must be after the start date'
        }
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
        index: true
    }
}, { timestamps:true })

//Automatically set renewal date based on frequency
//Middleware to set renewal date before saving the subscription
subscriptionSchema.pre('save', function(next) {
    if(!this.renewalDate){
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365
        };

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

    //Auto calculate the status if renewal date has passed
    if (this.renewalDate < new Date()){
        this.status = 'expired';
    }

    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;