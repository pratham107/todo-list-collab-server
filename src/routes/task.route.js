import mongoose from "mongoose";
import Task from "../schema/task.schema.js";
import express from "express";

const router = express.Router();

router.post("/add-todo",async (req,res)=>{
    const {title, description, dueDate, isPrivate} = req.body;
   
    // console.log(req.user)

    if(!req.user.id){
        return res.status(401).json({
            message: "Unauthorized",
            status:false
        })
    }
    
      
   if (new Date(dueDate).getTime() < Date.now()) {
        return res.status(400).json({
            message: "Due date must be in the future",
            status: false,
        });
    }

    const task = new Task({
        title:title,
        description:description,
        dueDate:dueDate,
        createdBy:req.user?.id,
        isPrivate:isPrivate
    })

    try {
        await task.save();
        res.status(201).json({
            message: "Task created successfully",
            status: true,
        })

    } catch (error) {
        res.status(400).json({
            message: "Failed to add task",
            status:false
        })
    }
})

router.patch("/edit-todo",async (req, res) => {
  try {
    const { id, title, description, dueDate, isPrivate } = req.body;

    const taskData = await Task.findById(id);
    if (!taskData) {
      return res.status(404).json({
        message: "Task not found",
        status: false,
      });
    }
    if (taskData.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to edit this task",
        status: false,
      });
    }

    if (dueDate && new Date(dueDate).getTime() < Date.now()) {
      return res.status(400).json({
        message: "Due date must be in the future",
        status: false,
      });
    }

    if (title !== undefined) taskData.title = title;
    if (description !== undefined) taskData.description = description;
    if (dueDate !== undefined) taskData.dueDate = new Date(dueDate);
    if (isPrivate !== undefined) taskData.isPrivate = isPrivate;

    await taskData.save();

    return res.status(200).json({
      message: "Task updated successfully",
      status: true,
      task: taskData,
    });
  } catch (error) {
    console.error("Edit Task Error:", error);
    res.status(500).json({
      message: "Server error while updating task",
      status: false,
    });
  }
});

router.delete("/delete-todo", async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Task ID is required",
        status: false,
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
        status: false,
      });
    }

    // Ensure only the creator can delete the task
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to delete this task",
        status: false,
      });
    }

    await Task.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Task deleted successfully",
      status: true,
    });
  } catch (error) {
    console.error("Delete Task Error:", error);
    return res.status(500).json({
      message: "Server error while deleting task",
      status: false,
    });
  }
});

router.patch("/update-status", async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!id || !status) {
      return res.status(400).json({
        message: "Task ID and status are required",
        status: false,
      });
    }

    const validStatuses = ["pending", "in-progress", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
        status: false,
      });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
        status: false,
      });
    }

    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to update this task",
        status: false,
      });
    }

    task.status = status;
    await task.save();

    return res.status(200).json({
      message: "Task status updated successfully",
      status: true,
      task,
    });
  } catch (error) {
    console.error("Status Update Error:", error);
    res.status(500).json({
      message: "Server error while updating status",
      status: false,
    });
  }
});

router.get("/all-my-tasks", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. Token missing or invalid.",
        status: false,
      });
    }
    const myTasks = await Task.find({ createdBy: userId }).sort({ dueDate: 1 });
    return res.status(200).json({
      message: "All tasks fetched successfully",
      status: true,
      data: myTasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
});

router.get("/all-other-task", async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. Token missing or invalid.",
        status: false,
      });
    }
    const otherTasks = await Task.find({
      createdBy: { $ne: userId },
      isPrivate: false,
    }).sort({ dueDate: 1 });

    return res.status(200).json({
      message: "Public tasks from other users fetched successfully",
      status: true,
      data: otherTasks,
    });
  } catch (error) {
    console.error("Error fetching public tasks from others:", error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
});

export default router;
