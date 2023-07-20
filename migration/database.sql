
--migration 

--table user
create table public.user(
	user_id serial not null unique,
	username varchar(255) not null unique,
	email varchar(255) not null UNIQUE,
	password varchar(255) not null,
	pin varchar(255),
	first_name varchar(50) NULL,
	last_name varchar(50) NULL,
	phone_number varchar(20) null UNIQUE,
	photo_profile text,
	status varchar(10),
	created_at timestamp without time zone null default now(),
	updated_at timestamp without time zone null	
)

--table account_balance 
create table public.account_balance(
	account_balance_id serial not null unique,
	user_id int not null UNIQUE,
	balance int default 0,
	income int default 0,
	expense int default 0,
	updated_at timestamp without time zone null,
	constraint account_balance_fk  foreign key(user_id) references public.user(user_id) on delete cascade
)

--table transaction_log 
create table public.transaction_log(
	transaction_id serial not null unique,
	sender_id int not null,
	receiver_id int default 0,
	amount int default 0,
	note text,
	transfer_date timestamp without time zone null,
	constraint transaction_log_fk  foreign key(account_balance_id) references public.account_balance(account_balance_id) on delete cascade
)


SELECT user_id, password FROM public.user WHERE email = $1
update public.user set status = 'active' where user_id = 1 
update public.user set status = 'pending' where email = '98hauzank@gmail.com'
delete from public.user where user_id = 13
delete from public.transaction_log tl  where transaction_id  < 99

SELECT sender_id, receiver_id, amount
FROM public.transaction_log
WHERE sender_id = 11 OR receiver_id =11

SELECT sender_id, receiver_id, amount, first_name, last_name, user_id
FROM public.transaction_log left outer join public.user on sender_id = 11 or receiver_id = 11 






