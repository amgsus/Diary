-- Table: public.note

-- DROP TABLE IF EXISTS public.note;

CREATE TABLE IF NOT EXISTS public.note
(
    id integer NOT NULL DEFAULT nextval('note_id_seq'::regclass),
    "timestamp" timestamp without time zone NOT NULL DEFAULT now(),
    note text COLLATE pg_catalog."default" NOT NULL,
    deleted boolean NOT NULL DEFAULT false,
    CONSTRAINT note_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.note
    OWNER to diary;
