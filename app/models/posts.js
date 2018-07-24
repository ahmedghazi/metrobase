// Example model

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostsSchema = new Schema({
  titre: String,
  texte: String
},{
    timestamps: true
});

PostsSchema.virtual('date')
  .get(() => this._id.getTimestamp());

mongoose.model('Posts', PostsSchema);

