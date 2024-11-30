show databases;

create database sketchup;

use sketchup;

create table room(
	idRoom varchar(45) primary key,
	criationDate timestamp default NOW(),
    qtdUsers int,
    constraint cheakQtdUsers check (qtdUsers > 0 and qtdUsers <= 10),
    status varchar(9) default 'active',
    constraint cheakStatus check (status in ('active', 'full', 'closed'))

);

INSERT INTO room (idRoom, qtdUsers, status)
VALUES 
('room1', 5, 'active'),
('room2', 10, 'full'),
('room3', 2, 'active'),
('room4', 1, 'active'),  
('room5', 8, 'closed');

INSERT INTO room (idRoom, qtdUsers, status)
VALUES 
('room6', 5, 'active'),
('room7', 10, 'active');

delete from room where idRoom = 'room3';


create table user (
	idUser int primary key auto_increment unique,
    username varchar(45) unique,
    email varchar(120) unique,
    password char(8),
    registerData datetime default now()
);

insert into user value (default, 'sardinha', 'leonardo_sardinha@outlook.com', 'Teste@28', default);

create table roomHistori (
	fkRoom varchar(45),
    fkUser int,
    constraint fkRoomRoomHistori foreign key (fkRoom) references room(idRoom),
    constraint fkUserRoomHistori foreign key (fkUser) references user(idUser),
    ranking int,
    points int,
    date timestamp default NOW()
);

create table draw (
	idDraw int auto_increment unique,
    fkUser int,
    constraint fkUserDraw foreign key (fkUser) references user(idUser),
    constraint pkComposta primary key (idDraw, fkUser),
    draw blob,
    createData datetime default now()
);

select * from user;