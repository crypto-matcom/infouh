# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170514191133) do

  create_table "markers", force: :cascade do |t|
    t.string   "name"
    t.string   "query"
    t.float    "lat"
    t.float    "lng"
    t.integer  "source_id"
    t.string   "color"
    t.string   "icon"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["source_id"], name: "index_markers_on_source_id"
  end

  create_table "questions", force: :cascade do |t|
    t.string   "name"
    t.integer  "source_id"
    t.string   "question"
    t.string   "query"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["source_id"], name: "index_questions_on_source_id"
  end

  create_table "sources", force: :cascade do |t|
    t.string   "adapter"
    t.string   "database"
    t.string   "host"
    t.string   "name"
    t.string   "username"
    t.string   "password"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
