const { Router } = require("express");
const { serve, setup } = require("swagger-ui-express");
const docrouter = Router();
// import dotenv from "dotenv";
// dotenv.config();
const options = {
  openapi: "3.0.1",
  info: {
    title: "My Brand",
    version: "1.0.0",
    description: "My Portifolio Backend.",
  },
  basePath: "/",
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    { name: "Users", description: "Users" },
    { name: "Blog", description: "Blogs" },
    { name: "Querries", description: "Querries" },
  ],
  paths: {
    "/signup": {
      post: {
        tags: ["Users"],
        description: "User signUp",
        security: [],
        parameters: [],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User",
              },
              example: {
                fullname: "fullname",
                email: "example@gmail.com",
                username: "user",
                password: "11111",
              },
            },
          },
          required: true,
        },
        responses: {
          201: {
            description: "New User was created successfully",
          },
          400: {
            description: "Bad Request",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },
    "/login": {
      post: {
        tags: ["Users"],
        description: "User login",
        security: [],
        parameters: [],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User",
              },
              example: {
                email: "admin@gmail.com",
                password: "12345",
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "successfully",
          },
          400: {
            description: "Invalid credation",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },
    "/users": {
      get: {
        tags: ["Users"],
        description: "Get All users",
        description: "This Api is used get All user from mongooDb ",
        parameters: [],
        security: [],
        responses: {
          200: {
            description: "successfully",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },
    "/users/{id}": {
      get: {
        security: [],
        tags: ["Users"],
        description: "Get One user by id",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
          },
        ],
        responses: {
          200: {
            description: "successfully",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },
    "/users/:id": {
      put: {
        tags: ["Users"],
        description: "Update blog article",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Blog",
              },
              example: {
                firstName: "fullname",
                email: "example@gmail.com",
                userame: "username",
                password: "123456",
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "successfully",
          },
          401: {
            description: "User Not Authorized",
          },
          404: {
            description: "Article doesn't exist!",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },

    "/users/{id}": {
      delete: {
        tags: ["Users"],
        description: "Delete User by Id",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User",
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "successfully",
          },
          401: {
            description: "User Not Authorized",
          },
          404: {
            description: "Article doesn't exist!",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },

    "/blog": {
      post: {
        tags: ["Blog"],
        description: "Create new blog article",
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/Blog",
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "successfully",
          },
          401: {
            description: "User Not Authorized",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },

    "/blogs": {
      get: {
        tags: ["Blog"],
        description: "Get All Blog Articles",
        parameters: [],
        security: [],
        responses: {
          200: {
            description: "successfully",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },

    "/blogs/{id}": {
      get: {
        security: [],
        tags: ["Blog"],
        description: "Get One user by id",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
          },
        ],
        responses: {
          200: {
            description: "successfully",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
      put: {
        tags: ["Blog"],
        description: "Update blog article",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
          },
        ],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/Blog",
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "successfully",
          },
          401: {
            description: "User Not Authorized",
          },
          404: {
            description: "Article doesn't exist!",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
      delete: {
        tags: ["Blog"],
        description: "Delete blog article",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Blog",
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "successfully",
          },
          401: {
            description: "User Not Authorized",
          },
          404: {
            description: "Article doesn't exist!",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },
    "/blogs/{id}/comment": {
      post: {
        tags: ["Blog"],
        description: "Comment on article blog article",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Blog",
              },
              example: {
                user_id: "",
                comment: "that content is very helpful thanks",
                postedDate: "24/03/2023",
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "successfully",
          },
          401: {
            description: "Not Authorized",
          },
          404: {
            description: "Article doesn't exist!",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },
    "/blogs/{id}/like": {
      post: {
        tags: ["Blog"],
        description: "Like on  blog ",
        parameters: [
          {
            in: "path",
            name: "blog_id",
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Blog",
              },
            },
          },
        },
        responses: {
          200: {
            description: "successfully",
          },
          401: {
            description: "Not Authorized",
          },
          404: {
            description: "Article doesn't exist!",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },
    "/querry": {
      post: {
        tags: ["Querries"],
        description: "User querry",
        security: [],
        parameters: [],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Querry",
              },
              example: {
                name: "fullname",
                email: "example@gmail.com",
                message: "nice work",
              },
            },
          },
          required: true,
        },
        responses: {
          201: {
            description: "Querry sent successfully",
          },
          400: {
            description: "Bad Request",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },
    "/querries": {
      get: {
        tags: ["Querries"],
        description: "Get All Querries",
        parameters: [],
        security: [],
        responses: {
          200: {
            description: "successfully",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },
    "/querries/{id}": {
      get: {
        security: [],
        tags: ["Querries"],
        description: "Get One Querry by id",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
          },
        ],
        responses: {
          200: {
            description: "successfully",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },
    "/querries/id": {
      delete: {
        tags: ["Querries"],
        description: "Delete Querry",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Querry",
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "successfully",
          },
          401: {
            description: "Querry Not Authorized",
          },
          404: {
            description: "Querry doesn't exist!",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "The auto-generated id of the user",
          },
          fullname: {
            type: "string",
            description: "User's fullname",
          },
          email: {
            type: "string",
            description: "User's email",
          },
          username: {
            type: "string",
            description: "User's username",
          },
          password: {
            type: "string",
            description: "User's password",
          },
          role: {
            type: "string",
            description: "User role",
            role: "users",
            enum: "admin,visitor",
            default: "visitor",
          },
        },
      },
      Blog: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Article title",
          },
          body: {
            type: "string",
            description: "Article content",
          },
          image: {
            type: "string",
            description: "Article image url",
            format: "binary",
          },
          // comments: {
          //   type: "string",
          //   description: "add a comment",
          // },
        },
      },
      Querry: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "The auto-generated id of the user",
          },
          name: {
            type: "string",
            description: "User's name",
          },
          email: {
            type: "string",
            description: "User's email",
          },
          message: {
            type: "string",
            description: "User querry",
          },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};
docrouter.use("/", serve, setup(options));
module.exports = docrouter;
