import multiprocessing
import time
from subprocess import run
from multiprocessing import Process


def worker_process_1():
    s1 = run(r"cd .. && npm run start", shell=True)


def worker_process_2():
    s1 = run(r"venv\Scripts\activate && cd ldappro && python manage.py runserver", shell=True)


def main():
    workers = []
    p1 = Process(target=worker_process_1)
    p1.start()
    # time.sleep(5)
    p2 = Process(target=worker_process_2)
    p2.start()


if __name__ == '__main__':
    multiprocessing.freeze_support()
    main()
