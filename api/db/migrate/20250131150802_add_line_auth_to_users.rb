class AddLineAuthToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :line_user_id, :string
    add_column :users, :profile_image_url, :string
    add_index :users, :line_user_id, unique: true
  end
end
