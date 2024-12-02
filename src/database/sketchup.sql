create database sketchup;

use sketchup;

create table drawingTheme(
	idDrawingTheme int auto_increment primary key,
    drawingTheme varchar(120)
);

insert into drawingTheme (drawingTheme) values 
('Unicórnio'),
('Pipoca'),
('Festa de aniversário'),
('Bolo de chocolate'),
('Gato astronauta'),
('Pizza gigante'),
('Super-herói de chinelo'),
('Zumbi dançarino'),
('Abóbora de Halloween'),
('Dragão de pelúcia'),
('Cachorro usando óculos'),
('Cavalo de skate'),
('Cenoura dançando'),
('Cachorrinho com chapéu'),
('Banana no espaço'),
('Coelho ninja'),
('Sereia cantando'),
('Girafa com dreadlocks'),
('Robô com personalidade'),
('Monstro de pelúcia'),
('Foca surfista'),
('Pinguim de terno'),
('Aranha no shopping'),
('Cachorro surfista'),
('Cachorro com bigode'),
('Gato astronauta'),
('Foca com chapéu de festa'),
('Vaca com asas de borboleta'),
('Cachorro viajante'),
('Elefante equilibrando bola'),
('Aranha com tênis de corrida'),
('Cavalo com óculos de sol'),
('Dragão chef de cozinha'),
('Robô jogador de futebol'),
('Peixe de óculos de sol'),
('Dino com tatuagem'),
('Bicho-preguiça no parque'),
('Coelho dando tchauzinho'),
('Zebra fazendo yoga'),
('Gato de patins'),
('Dino em uma cafeteria'),
('Chaveiro de avestruz'),
('Canguru boxeador'),
('Polvo com balão de festa'),
('Abacaxi com chapéu'),
('Leão de roupas estilosas'),
('Urso patinando'),
('Canguru usando fones de ouvido'),
('Macaco com balde de pipoca'),
('Cavalo no palco de show'),
('Coelho com geladeira'),
('Elefante tocando guitarra');


create table room(
	idRoom int auto_increment primary key,
	codRoom char(8) unique,
	criationDate timestamp default NOW(),
    qtdUsers int,
    constraint cheakQtdUsers check (qtdUsers > 0 and qtdUsers <= 10),
    status varchar(9) default 'active',
    constraint cheakStatus check (status in ('active', 'full', 'closed'))
);

desc room;

create table themeRoomHistory(
	fkRoom int,
	fkDrawingTheme int unique,
    constraint fkRoomThemeHistory foreign key (fkRoom) references room(idRoom),
    constraint fkDrawingThemeThemeHistory foreign key (fkDrawingTheme) references drawingTheme(idDrawingTheme),
    constraint pkComposta primary key (fkRoom, fkDrawingTheme)
);

create table user (
	idUser int primary key auto_increment unique,
    username varchar(45) unique,
    email varchar(120) unique,
    password char(8),
    registerData datetime default now()
);

insert into user value (default, 'sardinha', 'leonardo_sardinha@outlook.com', 'Teste@28', default);
insert into user value (default, 'anaKarol', 'ana@outlook.com', 'Teste@28', default);
insert into user value (default, 'testeSptech', 'teste@sptech.school', 'Teste@28', default);

create table userHistory (
	fkRoom int,
    fkUser int,
    fkDrawingTheme int,
    constraint fkDrawingThemeRoomHistory foreign key (fkDrawingTheme) references drawingTheme(idDrawingTheme),
    constraint fkRoomRoomHistory foreign key (fkRoom) references room(idRoom),
    constraint fkUserRoomHistory foreign key (fkUser) references user(idUser),
    constraint pkComposta primary key (fkRoom, fkUser, fkDrawingTheme),
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
select * from room;
select * from drawingTheme;
select * from userHistory;
