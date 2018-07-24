// Example model

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MetiersSchema = new Schema({
  title: String
},{
    timestamps: true
});

MetiersSchema.virtual('date')
  .get(() => this._id.getTimestamp());

mongoose.model('Metiers', MetiersSchema);

