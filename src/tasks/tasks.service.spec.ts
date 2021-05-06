import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from 'src/auth/user.entity';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './task.status.enum';
import { TasksService } from './tasks.service';

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockedUser = { id: 12, username: 'Test user' } as User;

describe('TaskService', () => {
  let taskService: TasksService;
  let taskRepository: TaskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TaskRepository,
          useFactory: mockTaskRepository,
        },
      ],
    }).compile();

    taskService = module.get<TasksService>(TasksService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('should get all tasks from the repository', async () => {
      (taskRepository.getTasks as jest.Mock).mockResolvedValue('someValue');
      expect(taskRepository.getTasks).not.toHaveBeenCalled();

      const filters: GetTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'Some search query',
      };
      const result = await taskService.getTasks(filters, mockedUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toBe('someValue');
    });
  });

  describe('getTaskById', () => {
    it('should call taskRepository.findOne() and successfully retrieve and return the task', async () => {
      const mockedTask = { title: 'Test task', description: 'Test desc' };
      (taskRepository.findOne as jest.Mock).mockResolvedValue(mockedTask);

      const result = await taskService.getTaskById(1, mockedUser);
      expect(result).toEqual(mockedTask);

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: mockedUser.id,
        },
      });
    });

    it('should throw an error as task is not found', () => {
      (taskRepository.findOne as jest.Mock).mockResolvedValue(null);
      expect(taskService.getTaskById(1, mockedUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
