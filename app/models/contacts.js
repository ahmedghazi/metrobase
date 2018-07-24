// Example model

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactsSchema = new Schema({
  society: String,
  lastname: String,
  firstname: String,
  email: String,
  fix: String,
  mobile: String,
  fonction: String,
  addresse_1: String,
  addresse_2: String,
  zip: String,
  city: String,
  country: String,
  date_created: {
      index: true,
      type: Date, default: Date.now
  },
  client: Boolean,

  metiers: [{type: Schema.Types.ObjectId, ref: 'Metiers'}],
  comments: [{type: Schema.Types.ObjectId, ref: 'Posts'}]
},{
    timestamps: true
});

ContactsSchema.virtual('date')
  .get(() => this._id.getTimestamp());

mongoose.model('Contacts', ContactsSchema);

