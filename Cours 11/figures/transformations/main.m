addpath('/media/hdd/Travail/Cours N7/TAV/TP10/Corrige')
addpath('/media/hdd/Travail/Cours N7/TAV/TP11/Corrige')

load parametres;

res = [];

path = "../../audio/samples/Karajan.wav";
[y, f_ech] = audioread(path);
y = mean(y, 2);
% y = y(1:5*f_ech);

% y = resample(y, 8000, f_ech);
% f_ech = 8000;

transform.name = 'original';
transform.y = y;
res = [res, transform];

[y_parole, ~] = audioread('../../audio/talking.mp3', [10001 10000+size(y,1)]);
y_bruit = ajout_bruit(y, y_parole, 2);
transform.name = 'bruit_parole';
transform.y = y_bruit;
res = [res, transform];

y_bruit = ajout_bruit(y, randn(size(y)), 10);
transform.name = 'bruit';
transform.y = y_bruit;
res = [res, transform];

y_pitch_shift = transposition(y, f_ech, 1.5);
transform.name = 'transposition';
transform.y = y_pitch_shift;
res = [res, transform];

y_time_scale = etirement_temporel(y, f_ech, 1.5);
transform.name = 'etirement_temporel';
transform.y = y_time_scale;
res = [res, transform];

audiowrite("../../audio/transforms/compression.mp3", y, f_ech, Quality=1)
% status = system("ffmpeg -i " + path + " -b:a 16k ../../audio/transforms/compression.wav")
[y_compression, f_ech] = audioread("../../audio/transforms/compression.mp3");
transform.name = 'compression';
transform.y = y_compression;
res = [res, transform];

figure(Name='Sonagramme', Position=[0.4*L,0,0.6*L,0.6*H]);
set(gcf, 'color', 'none');
set(gca, 'color', 'none');
for i = 1:length(res)
	audiowrite("../../audio/transforms/" + res(i).name + ".wav", res(i).y, f_ech);

	subplot(2,3,i)
	[Y,valeurs_t,valeurs_f] = TFCT(res(i).y(1:5*f_ech), f_ech, n_fenetre, n_decalage, fenetre);
	S = 20*log10(abs(Y)+eps);

	imagesc(valeurs_t, valeurs_f, S);
	
	% [pics_t, pics_f] = pics_spectraux(S, marge_t, marge_f, seuil);
	% hold on;
	% plot(valeurs_t(pics_t), valeurs_f(pics_f), 'ro', MarkerSize=10, MarkerFaceColor='r', LineWidth=2);
	
	caxis([-40 30]);
	axis xy;
	title(res(i).name, Interpreter='none')
end
saveas(gcf, 'transformations.png');

