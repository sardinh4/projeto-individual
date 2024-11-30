show databases;

create database sketchup;

use sketchup;

create table roon(
	idRoon varchar(45) primary key,
	criationDate timestamp default NOW(),
    qtdUsers int,
    constraint cheakQtdUsers check (qtdUsers > 0 and qtdUsers <= 10),
    status varchar(9) default 'active',
    constraint cheakStatus check (status in ('active', 'full', 'closed'))

);

INSERT INTO roon (idRoon, qtdUsers, status)
VALUES 
('room1', 5, 'active'),
('room2', 10, 'full'),
('room3', 2, 'active'),
('room4', 1, 'active'),  
('room5', 8, 'closed');

INSERT INTO roon (idRoon, qtdUsers, status)
VALUES 
('room6', 5, 'active'),
('room7', 10, 'active');

delete from roon where idRoon = 'room3';


create table user (
	idUser int primary key auto_increment unique,
    username varchar(45),
    email varchar(120),
    password char(8),
    registerData datetime default now()
);

insert into user value (default, 'sardinha', 'leonardo_sardinha@outlook.com', 'Teste@28', default);

create table roonHistori (
	fkRoon varchar(45),
    fkUser int,
    constraint fkRoonRoonHistori foreign key (fkRoon) references roon(idRoon),
    constraint fkUserRoonHistori foreign key (fkUser) references user(idUser),
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