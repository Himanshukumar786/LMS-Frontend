import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

const connectDB = async () => {

    try {
        const { connection } = await mongoose.connect(process.env.MONGO_URL); 
        if ( connection ) {
            console.log(`connected to MongoDB:${connection.host}`);
        }
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export default connectDB;
