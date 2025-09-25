const pool = require('../config/database');
const User = require('../models/User');

class UserRepository {
  async findByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await pool.query(query, [email]);

      if (result.rows.length === 0) {
        return null;
      }

      const userData = result.rows[0];
      return new User(
        userData.id,
        userData.email,
        userData.password,
        userData.name,
        userData.created_at,
        userData.updated_at
      );
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const query = 'SELECT * FROM users WHERE id = $1';
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      const userData = result.rows[0];
      return new User(
        userData.id,
        userData.email,
        userData.password,
        userData.name,
        userData.created_at,
        userData.updated_at
      );
    } catch (error) {
      console.error('Error finding user by id:', error);
      throw error;
    }
  }

  async create(userData) {
    try {
      const { name, email, password } = userData;
      const query = `
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      const result = await pool.query(query, [name, email, password]);
      const newUserData = result.rows[0];

      return new User(
        newUserData.id,
        newUserData.email,
        newUserData.password,
        newUserData.name,
        newUserData.created_at,
        newUserData.updated_at
      );
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async update(id, userData) {
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;

      Object.keys(userData).forEach(key => {
        if (userData[key] !== undefined) {
          fields.push(`${key} = $${paramCount}`);
          values.push(userData[key]);
          paramCount++;
        }
      });

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      fields.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);

      const query = `
        UPDATE users
        SET ${fields.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return null;
      }

      const updatedUserData = result.rows[0];
      return new User(
        updatedUserData.id,
        updatedUserData.email,
        updatedUserData.password,
        updatedUserData.name,
        updatedUserData.created_at,
        updatedUserData.updated_at
      );
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);

      return result.rows.length > 0;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

module.exports = UserRepository;