import mongoose, { Schema, model, models } from "mongoose";

const FavoriteSchema = new Schema({
  userId: { type: String, required: true },
  imdbId: { type: String, required: true },
  title: { type: String, required: true },
  poster: { type: String },
  rating: { type: String }
});

export default models.Favorite || model("Favorite", FavoriteSchema);
