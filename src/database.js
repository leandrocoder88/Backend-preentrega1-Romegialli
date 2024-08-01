import mongoose from "mongoose";

mongoose.connect("mongodb+srv://leandrocodex88:leandrocodex@cluster0.wpykl3d.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log('Conectado a la hipermegared de MongoDB'))
    .catch((error) => console.error('Allá la estan conectando a la base de datos,gilastrum!!!!!:', error));

export default mongoose;