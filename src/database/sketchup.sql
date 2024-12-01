show databases;

create database sketchup;
use sketchup;

create table room(
	idRoom int primary key auto_increment unique,
	codRoom varchar(45) unique,
	criationDate timestamp default NOW(),
    qtdUsers int,
    constraint cheakQtdUsers check (qtdUsers > 0 and qtdUsers <= 10),
    status varchar(9) default 'active',
    constraint cheakStatus check (status in ('active', 'full', 'closed'))

);

create table user (
	idUser int primary key auto_increment unique,
    username varchar(45) unique,
    email varchar(120) unique,
    password char(8),
    registerData datetime default now()
);

insert into user value (default, 'sardinha', 'leonardo_sardinha@outlook.com', 'Teste@28', default);

create table roomHistory (
	fkRoom int,
    fkUser int,
    constraint fkRoomRoomHistory foreign key (fkRoom) references room(idRoom),
    constraint fkUserRoomHistory foreign key (fkUser) references user(idUser),
    constraint pkComposta primary key (fkRoom, fkUser),
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